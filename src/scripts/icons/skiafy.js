/**
 * This script is based on a fork of Evan Stade's Skiafy
 * https://github.com/evanstade/skiafy
 * 
 * Copyright 2019 Evan Stade
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0
 */

const { JSDOM } = require('jsdom')
const { TinyColor } = require('@ctrl/tinycolor')

module.exports = function (
  svg,
  options = {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1,
    outputEnd: false,
    outputColor: false
  }
) {
  const dom = new JSDOM(svg)
  const svgNode = dom.window.document.querySelector('svg')
  let canvasSize = 0
  const viewBox = svgNode.getAttribute('viewBox')
  if (viewBox) {
    canvasSize = parseInt(viewBox.split(' ')[3])
  }
  if (canvasSize == 0) {
    canvasSize = parseInt(svgNode.getAttribute('width'))
  }
  if (isNaN(canvasSize)) {
    canvasSize = 0
  }
  let output = 'CANVAS_DIMENSIONS, ' + canvasSize + ',\n'

  options = options || {}
  const scaleX = typeof options.scaleX == 'number' ? options.scaleX : 1
  const scaleY = typeof options.scaleY == 'number' ? options.scaleY : 1
  const translateX =
    typeof options.translateX == 'number' ? options.translateX : 0
  const translateY =
    typeof options.translateY == 'number' ? options.translateY : 0
  const outputEnd =
    typeof options.outputEnd == 'boolean' ? options.outputEnd : false
  const outputColor =
    typeof options.outputColor == 'boolean' ? options.outputColor : false
  output += HandleNode(
    svgNode,
    scaleX,
    scaleY,
    translateX,
    translateY,
    outputColor
  )
  // Truncate final comma and newline.
  output = output.slice(0, -2)
  if (outputEnd) {
    output += ',\nEND'
  }
  output += '\n'
  return output
}

/* Code copy from main.js of https://github.com/evanstade/skiafy */

function ToCommand(letter) {
  switch (letter) {
    case 'M':
      return 'MOVE_TO'
    case 'm':
      return 'R_MOVE_TO'
    case 'L':
      return 'LINE_TO'
    case 'l':
      return 'R_LINE_TO'
    case 'H':
      return 'H_LINE_TO'
    case 'h':
      return 'R_H_LINE_TO'
    case 'V':
      return 'V_LINE_TO'
    case 'v':
      return 'R_V_LINE_TO'
    case 'A':
      return 'ARC_TO'
    case 'a':
      return 'R_ARC_TO'
    case 'C':
      return 'CUBIC_TO'
    case 'S':
      return 'CUBIC_TO_SHORTHAND'
    case 'c':
    case 's':
      return 'R_CUBIC_TO'
    case 'Z':
    case 'z':
      return 'CLOSE'
  }
  return '~UNKNOWN~'
}

function LengthForSvgDirective(letter) {
  switch (letter) {
    case 'C':
    case 'c':
    case 's':
      return 6
    case 'S':
      return 4
    case 'L':
    case 'l':
    case 'H':
    case 'h':
    case 'V':
    case 'v':
    case 'm':
    case 'M':
      return 2
    case 'A':
    case 'a':
      return 7
  }
  return 999
}

function SubsequentCommandForExtraArgs(letter) {
  switch (letter) {
    case 'm':
      return 'l'
    case 'M':
      return 'L'
  }
  return letter
}

function RoundToHundredths(x) {
  return Math.floor(x * 100 + 0.5) / 100
}

function HandleNode(
  svgNode,
  scaleX,
  scaleY,
  translateX,
  translateY,
  outputColor
) {
  // zhsoft88: custom handlers
  function HandleStroke(elem) {
    const isStrokePath =
      elem.getAttribute('stroke') && elem.getAttribute('stroke') != 'none'
    if (!isStrokePath) return ''

    const strokeWidth = parseInt(elem.getAttribute('stroke-width')) || 1
    return 'STROKE, ' + strokeWidth + ',\n'
  }
  function HandleColor(elem) {
    if (!outputColor) return ''

    let colorInfo = new TinyColor(elem.getAttribute('stroke'))
    if (!colorInfo.isValid) {
      colorInfo = new TinyColor(elem.getAttribute('fill'))
    }
    if (!colorInfo.isValid) return ''

    const upper = colorInfo.toHex().toUpperCase()
    const r = upper.substr(1, 2)
    const g = upper.substr(3, 2)
    const b = upper.substr(5, 2)
    return `NEW_PATH,\nPATH_COLOR_ARGB, 0xFF, 0x${r}, 0x${g}, 0x${b},\n`
  }
  function RunHandles(elem) {
    let output = ''
    for (const func of [HandleStroke, HandleColor]) {
      output += func(elem)
    }
    return output
  }

  var output = ''
  for (var idx = 0; idx < svgNode.children.length; ++idx) {
    var svgElement = svgNode.children[idx]
    switch (svgElement.tagName) {
      // g ---------------------------------------------------------------------
      case 'g':
        if (svgElement.getAttribute('transform')) {
          output += '<g> with a transform not handled\n'
          break
        }

        return HandleNode(
          svgElement,
          scaleX,
          scaleY,
          translateX,
          translateY,
          outputColor
        )

      // PATH ------------------------------------------------------------------
      case 'path':
        var isStrokePath =
          svgElement.getAttribute('stroke') &&
          svgElement.getAttribute('stroke') != 'none'
        // If fill is none and doesn't have stroke, this is probably one of those worthless paths
        // of the form <path fill="none" d="M0 0h24v24H0z"/>
        if (svgElement.getAttribute('fill') == 'none' && !isStrokePath) break

        var commands = []
        var path = svgElement.getAttribute('d').replace(/,/g, ' ').trim()
        if (path.slice(-1).toLowerCase() !== 'z') path += 'z'
        while (path) {
          var point = parseFloat(path)
          if (isNaN(point)) {
            var letter = path[0]
            path = path.substr(1)
            commands.push({ 'command': letter, 'args': [] })
          } else {
            var currentCommand = commands[commands.length - 1]
            var svgDirective = currentCommand.command
            if (
              currentCommand.args.length == LengthForSvgDirective(svgDirective)
            ) {
              commands.push({
                'command': SubsequentCommandForExtraArgs(svgDirective),
                'args': []
              })
              currentCommand = commands[commands.length - 1]
              svgDirective = currentCommand.command
            }

            var pathNeedsPruning = true
            if (
              svgDirective.toLowerCase() == 'a' &&
              currentCommand.args.length >= 3 &&
              currentCommand.args.length <= 4
            ) {
              point = parseInt(path[0])
              console.assert(
                point == 0 || point == 1,
                'Unexpected arc argument ' << point
              )
              path = path.substr(1)
              pathNeedsPruning = false
            }

            // Insert implicit points.
            if (
              svgDirective.toLowerCase() == 's' &&
              currentCommand.args.length == 0
            ) {
              if (svgDirective == 's') {
                var lastCommand = commands[commands.length - 2]
                if (ToCommand(lastCommand.command).search('CUBIC_TO') >= 0) {
                  // The first control point is assumed to be the reflection of
                  // the second control point on the previous command relative
                  // to the current point.
                  var lgth = lastCommand.args.length
                  currentCommand.args.push(
                    RoundToHundredths(
                      lastCommand.args[lgth - 2] - lastCommand.args[lgth - 4]
                    )
                  )
                  currentCommand.args.push(
                    RoundToHundredths(
                      lastCommand.args[lgth - 1] - lastCommand.args[lgth - 3]
                    )
                  )
                } else {
                  // "If there is no previous command or if the previous command
                  // was not an C, c, S or s, assume the first control point is
                  // coincident with the current point."
                  currentCommand.args.push(0)
                  currentCommand.args.push(0)
                }
              }
            }

            // Whether to apply flipping and translating transforms to the
            // argument. Only the last two arguments (out of 7) in an arc
            // command are coordinates.
            var transformArg = true
            // xAxis is true when the current coordinate refers to the xAxis.
            var xAxis = currentCommand.args.length % 2 == 0
            if (svgDirective.toLowerCase() == 'a') {
              if (currentCommand.args.length < 5) transformArg = false
              xAxis = currentCommand.args.length % 2 == 1
            } else if (svgDirective.toLowerCase() == 'v') {
              xAxis = false
            }
            if (transformArg) {
              point *= xAxis ? scaleX : scaleY
              if (svgDirective != svgDirective.toLowerCase())
                point += xAxis ? translateX : translateY
            }
            point = RoundToHundredths(point)
            currentCommand.args.push(point)

            if (pathNeedsPruning) {
              var dotsSeen = 0
              for (var i = 0; i < path.length; ++i) {
                if (i == 0 && path[i] == '-') continue
                if (!isNaN(parseInt(path[i]))) continue
                if (path[i] == '.' && ++dotsSeen == 1) continue
                // zhsoft88: fix "L-1.0658141e-14 7.2335" parse error
                if (dotsSeen && path[i] == 'e') {
                  i++
                  if (i < path.length && path[i] == '-') i++
                  while (i < path.length && !isNaN(parseInt(path[i]))) {
                    i++
                  }
                }

                path = path.substr(i)
                break
              }
            }
          }

          path = path.trim()
        }

        /*        if (isStrokePath) {
                          var strokeWidth =  svgElement.getAttribute('stroke-width');
                          if (!strokeWidth || isNaN(strokeWidth))
                            strokeWidth = 1;
                
                          output += 'STROKE, ' + strokeWidth + ',\n';
                        }*/

        output += RunHandles(svgElement)
        for (const command_idx in commands) {
          var command = commands[command_idx]
          output += ToCommand(command.command) + ', '
          for (i in command.args) {
            var point = command.args[i]
            output += point
            if (typeof point == 'number' && (point * 10) % 10 != 0)
              output += 'f'
            output += ', '
          }
          output = output.trim() + '\n'
        }
        break

      // CIRCLE ----------------------------------------------------------------
      case 'circle':
        var cx = parseFloat(svgElement.getAttribute('cx'))
        cx *= scaleX
        cx += translateX
        var cy = parseFloat(svgElement.getAttribute('cy'))
        cy *= scaleY
        cy += translateY
        var rad = parseFloat(svgElement.getAttribute('r'))
        output += RunHandles(svgElement)
        output += 'CIRCLE, ' + cx + ', ' + cy + ', ' + rad + ',\n'
        break

      // RECT ------------------------------------------------------------------
      case 'rect':
        var x = parseFloat(svgElement.getAttribute('x')) || 0
        x *= scaleX
        x += translateX
        var y = parseFloat(svgElement.getAttribute('y')) || 0
        y *= scaleY
        y += translateY
        var width = parseFloat(svgElement.getAttribute('width'))
        var height = parseFloat(svgElement.getAttribute('height'))

        output += RunHandles(svgElement)
        output +=
          'ROUND_RECT, ' + x + ', ' + y + ', ' + width + ', ' + height + ', '

        var round = svgElement.getAttribute('rx')
        if (!round) round = '0'
        output += round + ',\n'
        break
    }
  }
  return output
}

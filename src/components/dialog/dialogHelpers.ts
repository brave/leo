import type { ButtonKind } from '../button/props'
import DialogHelper from './dialogsContainer.svelte'
import { writable } from 'svelte/store'

let helper: DialogHelper | undefined
export const ensureDialogHelper = () => {
  if (helper) return

  const mountPoint = document.createElement('div')
  mountPoint.id = 'leo-dialog-helper'

  document.body.appendChild(mountPoint)

  helper = new DialogHelper({
    target: mountPoint
  })
}

interface Action {
  result?: any
  text: string
  kind?: ButtonKind
}

interface AlertOptions {
  title: string
  body?: string
  actions: Action[]
}

interface AlertInfo extends AlertOptions {
  resolve: (result?: any) => void
}

export const dialogs = writable<AlertInfo[]>([])

export const dialog = <T>(options: AlertOptions) => {
  ensureDialogHelper()

  const promise = new Promise((accept) => {
    const info = {
      title: options.title,
      body: options.body,
      actions: options.actions,
      resolve: (result?: T) => {
        dialogs.update((d) => d.filter((i) => i !== info))
        accept(result)
      }
    }
    dialogs.update((d) => [...d, info])
  })

  return promise
}

interface AlertDialogOptions {
  okText: string
}

export const alert = (message: string, options: AlertDialogOptions) =>
  dialog({
    title: message,
    actions: [
      {
        text: options.okText
      }
    ]
  })

interface ConfirmDialogOptions {
  okText: string
  cancelText: string
}

export const confirm = (message: string, options: ConfirmDialogOptions) =>
  dialog({
    title: message,
    actions: [
      {
        result: false,
        kind: 'outline',
        text: options.cancelText
      },
      {
        result: true,
        kind: 'filled',
        text: options.okText
      }
    ]
  }).then((r) => !!r)

const leo = (window as any)?.leo ?? ((window as any).leo = {})
leo.alert = alert
leo.confirm = confirm
leo.dialog = dialog

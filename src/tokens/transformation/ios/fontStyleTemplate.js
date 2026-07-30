export default (style) => `
//
//  ${style.filename}
//
//  Created by Design Token Generator.
//

import UIKit

public class ${style.class} {

  enum Fonts {
    ${style.font.join('\n    ')}
  }

  enum LineHeight {
    ${style.lineheight.join('\n    ')}
  }

  enum Leading {
    ${style.leading.join('\n    ')}
  }

}
`

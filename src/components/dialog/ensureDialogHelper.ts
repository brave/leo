import DialogHelper from './dialogHelper.svelte'

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

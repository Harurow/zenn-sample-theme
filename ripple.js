/**
 * マウスダウンのリップルイベントハンドラ
 * @param {*} e
 */
 function onRipple (e) {
  const target = $(e.currentTarget)
  const targetW = target.innerWidth()
  const targetH = target.innerHeight()
  const x = e.offsetX
  const y = e.offsetY
  const size = Number.parseInt(Math.max(x, y, targetW - x, targetH - y) * 2)
  const w = size
  const h = size

  const effect = $('<span class="ripple-effect"></span>')
    .css({
      left: x - w / 2,
      top: y - h / 2,
      width: size,
      height: size
      })
    .appendTo(this)
  
  const onMouseUp = (e) => {
    effect.remove()
    target.off('mouseup', onMouseUp)
  }

  target.on('mouseup', onMouseUp)
}

/**
 * リップル初期化
 */
function initRipples () {
  $('.ripple')
    .mousedown(onRipple)
}

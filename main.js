const ThemeMode = {
  Auto: null,
  Dark: 'dark',
  Light: 'light'
}

let themMode = ThemeMode.Auto

function getBrowserTheme (mediaQueryList) {
  return mediaQueryList.matches ? 'dark' : 'light'
}

function setTheme (mediaQueryList) {
  const theme = themMode ?? getBrowserTheme(mediaQueryList)
  const htmlElement = document.body.parentElement
  htmlElement.setAttribute('theme', theme)

  const style = getComputedStyle(htmlElement)
  const rgb = style.getPropertyValue('--p-color').trim()
  $('#primary-color').val(rgb)
  clearCustomColorPallet()
}

function clearCustomColorPallet() {
  const bodyStyle = document.body.style
  bodyStyle.removeProperty('--p-color')
  bodyStyle.removeProperty('--p-highlight')
}

const mql = window.matchMedia('(prefers-color-scheme: dark)')
mql.addEventListener('change', setTheme)
setTheme(mql)

$(() => {
  initRipples()

  $('.theme-auto').on('click', () => {
    themMode = ThemeMode.Auto
    setTheme(mql)
  })

  $('.theme-light').on('click', () => {
    themMode = ThemeMode.Light
    setTheme(mql)
  })
  
  $('.theme-dark').on('click', () => {
    themMode = ThemeMode.Dark
    setTheme(mql)
  })

  $('#primary-color').on('change', () => {
    const body = document.body
    const computedStyle = getComputedStyle(body)
    const themeRgb = computedStyle.getPropertyValue('--p-color').trim()
    const pickerRgb = $('#primary-color').val()
    console.log(pickerRgb)

    if (themeRgb !== pickerRgb) {
      const r = Number.parseInt(pickerRgb.substring(1, 3), 16)
      const g = Number.parseInt(pickerRgb.substring(3, 5), 16)
      const b = Number.parseInt(pickerRgb.substring(5, 7), 16)
      const { h, s, l } = rgba2hsla({r, g, b})
      body.style.setProperty('--p-color', pickerRgb)
      body.style.setProperty('--p-highlight', `hsl(${h}, ${s}%, ${Math.min(l + 20, 100)}%)`)

    } else {
      clearCustomColorPallet()
    }
  })
})

const rgba2hsla = ({ r, g, b, a }) => {
  console.log(r, g, b)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const hsla = {
    h: 0,
    s: 0,
    l: (max + min) / 2,
    a: a ?? 255
  }
  const diff = max - min

  if (min !== max) {
    if (max === r) {
      hsla.h = 60 * (g - b) / diff
    } else if (max === g) {
      hsla.h = 60 * (b - r) / diff + 120
    } else if (max === b) {
      hsla.h = 60 * (r - g) / diff + 240
    }
  }

  hsla.s = diff / ((hsla.l <= 127) ? (max + min) : 510 - diff)

  if (hsla.h < 0) {
    hsla.h += 360
  }

  hsla.h = Math.round(hsla.h)
  hsla.s = Math.round(hsla.s * 100)
  hsla.l = Math.round((hsla.l * 100 / 255))
  hsla.a = hsla.a / 255

  return hsla
}

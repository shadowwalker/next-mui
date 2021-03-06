import React, { useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import createMuiTheme, { ThemeOptions, Theme } from '@material-ui/core/styles/createMuiTheme'
import { StylesProvider, ThemeProvider, createGenerateClassName } from '@material-ui/styles'
import flush from 'styled-jsx/server'
import { StylesCreator } from '@material-ui/core/styles/withStyles'
import { SheetsRegistry } from 'jss'

interface ISheetManagerTheme {
  refs: number
  sheet: StyleSheet
}

type SheetManager = Map<StylesCreator, Map<Theme, ISheetManagerTheme>>

interface IMuiContext {
  theme: Theme
  sheetsManager: SheetManager
  sheetsRegistry: SheetsRegistry
  generateClassName: any
}

const createMuiContext = (theme?: Theme | ThemeOptions): IMuiContext => {
  return {
    generateClassName: createGenerateClassName(),
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    theme: 'mixins' in theme && typeof theme.mixins.gutters === 'function' ? theme as Theme : createMuiTheme(theme)  // check if theme is already a Theme object
  }
}

let muiContext: IMuiContext

const getMuiContext = (theme?: Theme | ThemeOptions): IMuiContext => {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  const isBrowser = typeof window !== 'undefined'
  if (isBrowser) {
    if (!muiContext) {
      muiContext = createMuiContext(theme)
    }
    return muiContext
  } else {
    muiContext = createMuiContext(theme)
    return muiContext
  }
}

const MuiStyles = () => (
  <>
    { muiContext ?
      <style id='jss-server-side' dangerouslySetInnerHTML={{ __html: muiContext.sheetsRegistry.toString() }}/>
      :
      <style id='jss-server-side'>/* ERROR: MUI context is undefined */</style>
    }
    {flush() || null}
  </>
)

const MUI = ({theme, children}: {
  theme?: Theme | ThemeOptions,
  children: React.ReactNode
}) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])

  muiContext = getMuiContext(theme)
  return (
    <StylesProvider
      generateClassName={muiContext.generateClassName}
      sheetsRegistry={muiContext.sheetsRegistry}
      sheetsManager={muiContext.sheetsManager}
    >
      <ThemeProvider theme={muiContext.theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StylesProvider>
  )
}

export {
  MUI as default,
  MuiStyles
}

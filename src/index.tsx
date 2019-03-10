import './bootstrap'
import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
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
  generateClassName: any // TODO: type incompatible
}

const createMuiContext = (themeOptions?: ThemeOptions): IMuiContext => {
  return {
    generateClassName: createGenerateClassName(),
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    theme: createMuiTheme(themeOptions)
  }
}

let muiContext: IMuiContext

const getMuiContext = (themeOptions?: ThemeOptions): IMuiContext => {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  const isBrowser = typeof window !== 'undefined'
  if (isBrowser) {
    if (!muiContext) {
      muiContext = createMuiContext(themeOptions)
    }
    return muiContext
  } else {
    muiContext = createMuiContext(themeOptions)
    return muiContext
  }
}

const MuiHead = ({ fontIcons, disableUserScalable }: {
  fontIcons?: boolean
  disableUserScalable?: boolean
}) => {
  if (!muiContext) {
    return null
  } else {
    return (
      <>
        {/* tslint:disable:max-line-length */}
        <meta name='viewport' content={'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no' + (disableUserScalable ? ', user-scalable=no' : '')} key='viewport' />
        {/* tslint:enable:max-line-length */}
        <meta name='theme-color' content={muiContext.theme.palette.primary.main} key='theme-color' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' />
        {fontIcons ? <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' /> : null}
      </>
    )
  }
}

const MuiStyles = () => (
  <>
    { muiContext ?
      <style id='jss-server-side' dangerouslySetInnerHTML={{ __html: muiContext.sheetsRegistry.toString() }}/>
      :
      <style id='jss-server-side'>{'<!-- ERROR: MUI context is undefined -->'}</style>
    }
    {flush() || null}
  </>
)

type WithMui = (Component: React.ComponentType) => React.ComponentType

const withMui = (themeOptions?: ThemeOptions): WithMui => {
  muiContext = getMuiContext(themeOptions)

  return (Component: React.ComponentType): React.ComponentType => {
    class MuiComponent extends React.Component {
      componentDidMount() {
        /*
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles && jssStyles.parentNode) {
          jssStyles.parentNode.removeChild(jssStyles)
        }
        */
      }

      render() {
        return (
          <StylesProvider
            generateClassName={muiContext.generateClassName}
            sheetsRegistry={muiContext.sheetsRegistry}
            sheetsManager={muiContext.sheetsManager}
          >
            <ThemeProvider theme={muiContext.theme}>
              <CssBaseline />
              <Component {...this.props} />
            </ThemeProvider>
          </StylesProvider>
        )
      }
    }

    // display name
    (MuiComponent as React.ComponentType).displayName =
      `MUI(${Component.displayName || Component.name || 'Component'})`

    // Copy statics
    hoistNonReactStatic(MuiComponent, Component)

    return MuiComponent
  }
}

export {
  withMui,
  MuiHead,
  MuiStyles
}

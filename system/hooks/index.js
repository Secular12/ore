import ready from './ready.js'
import renderChatMessage from './renderChatMessage.js'
import renderSceneControls from './renderSceneControls.js'

export default () => {
  Hooks.on('ready', ready)
  Hooks.on('renderChatMessage', renderChatMessage)
  Hooks.on('renderSceneControls', renderSceneControls)
}
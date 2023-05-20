import {Plugin, registerPlugin} from 'enmity/managers/plugins'
import {React} from 'enmity/metro/common'
import {create} from 'enmity/patcher'
// @ts-ignore
import manifest, {name as plugin_name} from '../manifest.json'
import {getByProps} from "enmity/modules"

const Patcher = create('FixVoiceMessageCrashPatch')
const ReactNative = getByProps("View")
const { DCDChatManager } = ReactNative.NativeModules

const FixVoiceMessageCrashPatch: Plugin = {
    ...manifest,
    onStart() {
        Patcher.before(DCDChatManager, "updateRows", (_, args, __) => {
            const rows = JSON.parse(args[1])
            for ( const row of rows ) {
                if (row.message?.flags === 8192){
                    row.message.flags = 0
                    // row.message.attachments = []
                    // row.message.content = "[VoiceMessage]"
                }
            }
            args[1] = JSON.stringify(rows)
        })
    },
    onStop() {
        Patcher.unpatchAll()
    }
}

registerPlugin(FixVoiceMessageCrashPatch)

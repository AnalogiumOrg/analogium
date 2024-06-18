import type MarkdownIt from "markdown-it"
import type { StateCore } from "markdown-it/index.js"

const audio_exts = [".mp3", ".wav", ".ogg"]

export default function audios_plugin(md: MarkdownIt): void {
	md.core.ruler.push("analogium_audio", audio_rule)
}

function audio_rule(state: StateCore): boolean {
	for (const token of state.tokens) {
		if (token.type === "link_open" && token.attrGet("href")?.endsWith(".mp3")) {
			token.tag = "audio"
			token.attrSet("controls", "")
		}
	}
	return true
}
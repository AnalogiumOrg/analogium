import mitt from 'mitt'

const globalEmitter = mitt<{
	"modifier-applied": void;
}>()

export const useEvent = globalEmitter.emit
export const useListen = globalEmitter.on
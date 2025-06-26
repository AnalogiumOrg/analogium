import mitt from "mitt";

const globalEmitter = mitt();

export const useEvent = globalEmitter.emit;
export const useListen = globalEmitter.on;

//https://github.com/webpack-contrib/raw-loader/issues/56

declare module '*.webm'
declare module '*.mp4'
declare module '*.jpg'
declare module 'raw-loader!*' {
    const content: string;
    export default content;
}

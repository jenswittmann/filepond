// Based on definitions by Zach Posten for React-Filepond <https://github.com/zposten>
// Updated by Hawxy <https://github.com/Hawxy>
// TypeScript Version: 3.5

export { };

export enum FileStatus {
    INIT = 1,
    IDLE = 2,
    PROCESSING_QUEUED = 9,
    PROCESSING = 3,
    PROCESSING_COMPLETE = 5,
    PROCESSING_ERROR = 6,
    PROCESSING_REVERT_ERROR = 10,
    LOADING = 7,
    LOAD_ERROR = 8
}

export enum Status {
    EMPTY = 0,
    IDLE = 1,
    ERROR = 2,
    BUSY = 3,
    READY = 4
}

export enum FileOrigin {
    INPUT = 1,
    LIMBO = 2,
    LOCAL = 3
}

type ActualFileObject = Blob & { readonly lastModified: number; readonly name: string; readonly size: number; readonly type: string };

export class File {
    /** Returns the ID of the file. */
    id: string;
    /** Returns the server id of the file. */
    serverId: string;
    /** Returns the origin of the file. */
    origin: 'input' | 'limbo' | 'local';
    /** Returns the current status of the file. */
    status: FileStatus;
    /** Returns the File object. */
    file: ActualFileObject;
    /** Returns the file extensions. */
    fileExtension: string;
    /** Returns the size of the file. */
    fileSize: number;
    /** Returns the type of the file. */
    fileType: string;
    /** Returns the full name of the file. */
    filename: string;
    /** Returns the name of the file without extension. */
    filenameWithoutExtension: string;

    /** Aborts loading of this file */
    abortLoad: () => void;
    /** Aborts processing of this file */
    abortProcessing: () => void;
    /**
     * Retrieve metadata saved to the file, pass a key to retrieve
     * a specific part of the metadata (e.g. 'crop' or 'resize').
     * If no key is passed, the entire metadata object is returned.
     */
    getMetadata: (key?: string) => any;
    /** Add additional metadata to the file */
    setMetadata: (key: string, value: any) => void;
}

interface ServerUrl {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    withCredentials?: boolean;
    headers?: { [key: string]: string | boolean | number };
    timeout?: number;

    /**
     * Called when server response is received, useful for getting
     * the unique file id from the server response.
     */
    onload?: (response: any) => number | string;
    /**
     * Called when server error is received, receives the response
     * body, useful to select the relevant error data.
     */
    onerror?: (responseBody: any) => any;
    /**
     * Called with the formdata object right before it is sent,
     * return extended formdata object to make changes.
     */
    ondata?: (data: FormData) => FormData;
}

type ProgressServerConfigFunction = (
    /**
     * Flag indicating if the resource has a length that can be calculated.
     * If not, the totalDataAmount has no significant value.  Setting this to
     * false switches the FilePond loading indicator to infinite mode.
     */
    isLengthComputable: boolean,
    /** The amount of data currently transferred. */
    loadedDataAmount: number,
    /** The total amount of data to be transferred. */
    totalDataAmount: number,
) => void;

type ProcessServerConfigFunction = (
    /** The name of the input field. */
    fieldName: string,
    /** The actual file object to send. */
    file: ActualFileObject,
    metadata: { [key: string]: any },
    /**
     * Should call the load method when done and pass the returned server file id.
     * This server file id is then used later on when reverting or restoring a file
     * so that your server knows which file to return without exposing that info
     * to the client.
     */
    load: (p: string | { [key: string]: any }) => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load().
     * Setting computable to false switches the loading indicator to infinite mode.
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled. */
    abort: () => void
) => void;

type RevertServerConfigFunction = (
    /** Server file id of the file to restore. */
    uniqueFieldId: any,
    /** Should call the load method when done. */
    load: () => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void
) => void;

type RestoreServerConfigFunction = (
    /** Server file id of the file to restore. */
    uniqueFileId: any,
    /** Should call the load method with a file object or blob when done. */
    load: (file: ActualFileObject) => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load().
     * Setting computable to false switches the loading indicator to infinite mode.
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled. */
    abort: () => void,
    /**
     * Can call the headers method to supply FilePond with early response header string.
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
     */
    headers: (headersString: string) => void
) => void;

type LoadServerConfigFunction = (
    source: any,
    /** Should call the load method with a file object or blob when done. */
    load: (file: ActualFileObject | Blob) => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load().
     * Setting computable to false switches the loading indicator to infinite mode.
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled. */
    abort: () => void,
    /**
     * Can call the headers method to supply FilePond with early response header string.
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders>
     */
    headers: (headersString: string) => void
) => void;

type FetchServerConfigFunction = (
    url: string,
    /** Should call the load method with a file object or blob when done. */
    load: (file: ActualFileObject | Blob) => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load().
     * Setting computable to false switches the loading indicator to infinite mode.
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled. */
    abort: () => void,
    /**
     * Can call the headers method to supply FilePond with early response header string.
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
     */
    headers: (headersString: string) => void
) => void;

type RemoveServerConfigFunction = (
    /** Local file source */
    source: any,
    /** Call when done */
    load: () => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void
) => void;

interface FilePondInitialFile {
    /** The server file reference. */
    source: string;
    options: {
        /** Origin of file being added. */
        type: 'input' | 'limbo' | 'local';
        /** Mock file information. */
        file?: {
            name?: string;
            size?: number;
            type?: string;
        };
        /** File initial metadata. */
        metadata?: { [key: string]: any };
    };
}

interface FilePondServerConfigProps {
    /**
     * Server API Configuration.
     * See: https://pqina.nl/filepond/docs/patterns/api/server
     * @default null
     */
    server?: string | {
        url?: string
        timeout?: number
        headers?: { [key: string]: string | boolean | number };
        process?: string | ServerUrl | ProcessServerConfigFunction | null;
        revert?: string | ServerUrl | RevertServerConfigFunction | null;
        restore?: string | ServerUrl | RestoreServerConfigFunction | null;
        load?: string | ServerUrl | LoadServerConfigFunction | null;
        fetch?: string | ServerUrl | FetchServerConfigFunction | null;
        remove?: RemoveServerConfigFunction | null;
    };
    /**
     * Immediately upload new files to the server.
     * @default true
     */
    instantUpload?: boolean;
    /**
     * A list of file locations that should be loaded immediately.
     * See: https://pqina.nl/filepond/docs/patterns/api/filepond-object/#setting-initial-files
     * @default []
     */
    files?: Array<FilePondInitialFile | ActualFileObject | Blob | string>;
}

interface FilePondDragDropProps {
    /**
     * FilePond will catch all files dropped on the webpage.
     * @default false
     */
    dropOnPage?: boolean;
    /** 
     * Require drop on the FilePond element itself to catch the file.
     * @default true
     */
    dropOnElement?: boolean;
    /**
     * When enabled, files are validated before they are dropped.
     * A file is not added when it’s invalid.
     * @default false
     */
    dropValidation?: boolean;
    /**
     * Ignored file names when handling dropped directories.
     * Dropping directories is not supported on all browsers.
     * @default ['.ds_store', 'thumbs.db', 'desktop.ini']
     */
    ignoredFiles?: string[];
}

interface FilePondLabelProps {
    /**
     * The decimal separator used to render numbers.
     * By default this is determined automatically.
     * @default 'auto'
     */
    labelDecimalSeparator?: string;
    /**
     * The thousands separator used to render numbers.
     * By default this is determined automatically.
     * @default 'auto'
     */
    labelThousandsSeparator?: string;
    /**
     * Default label shown to indicate this is a drop area.
     * FilePond will automatically bind browse file events to
     * the element with CSS class .filepond--label-action.
     * @default 'Drag & Drop your files or <span class="filepond--label-action"> Browse </span>'
     */
    labelIdle?: string;
    /**
     * Label shown when the field contains invalid files and is validated by the parent form.
     * @default 'Field contains invalid files'
     */
    labelInvalidField?: string;
    /**
     * Label used while waiting for file size information.
     * @default 'Waiting for size'
     */
    labelFileWaitingForSize?: string;
    /**
     * Label used when no file size information was received.
     * @default 'Size not available'
     */
    labelFileSizeNotAvailable?: string;
    /**
     * Label used when showing the number of files and there is only one.
     * @default 'file in list'
     */
    labelFileCountSingular?: string;
    /**
     * Label used when showing the number of files and there is more than one.
     * @default 'files in list'
     */
    labelFileCountPlural?: string;
    /**
     * Label used while loading a file.
     * @default 'Loading'
     */
    labelFileLoading?: string;
    /**
     * Label used when file load failed.
     * @default 'Error during load'
     */
    labelFileLoadError?: string;
    /**
     * Label used when uploading a file.
     * @default 'Uploading'
     */
    labelFileProcessing?: string;
    /**
     * Label used when file upload has completed.
     * @default 'Upload complete'
     */
    labelFileProcessingComplete?: string;
    /**
     * Label used when upload was cancelled.
     * @default 'Upload cancelled'
     */
    labelFileProcessingAborted?: string;
    /**
     * Label used when something went wrong during file upload.
     * @default 'Error during upload'
     */
    labelFileProcessingError?: string;
    /**
     * Label used when something went wrong during reverting the file upload.
     * @default 'Error during revert'
     */
    labelFileProcessingRevertError?: string;
    /**
     * Label used when something went during during removing the file upload.
     * @default 'Error during remove'
     */
    labelFileRemoveError?: string;
    /**
     * Label used to indicate to the user that an action can be cancelled.
     * @default 'tap to cancel'
     */
    labelTapToCancel?: string;
    /**
     * Label used to indicate to the user that an action can be retried.
     * @default 'tap to retry'
     */
    labelTapToRetry?: string;
    /**
     * Label used to indicate to the user that an action can be undone.
     * @default 'tap to undo'
     */
    labelTapToUndo?: string;
    /**
     * Label used for remove button.
     * @default 'Remove'
     */
    labelButtonRemoveItem?: string;
    /**
     * Label used for abort load button.
     * @default 'Abort'
     */
    labelButtonAbortItemLoad?: string;
    /**
     * Label used for retry load.
     * @default 'Retry'
     */
    labelButtonRetryItemLoad?: string;
    /**
     * Label used for abort upload button.
     * @default 'Cancel'
     */
    labelButtonAbortItemProcessing?: string;
    /**
     * Label used for undo upload button.
     * @default 'Undo'
     */
    labelButtonUndoItemProcessing?: string;
    /**
     * Label used for retry upload button.
     * @default 'Retry'
     */
    labelButtonRetryItemProcessing?: string;
    /**
     * Label used for upload button.
     * @default 'Upload'
     */
    labelButtonProcessItem?: string;
}

interface FilePondSvgIconProps {
    /**
     * The icon used for remove actions.
     * @default '<svg></svg>'
     */
    iconRemove?: string;
    /**
     * The icon used for process actions.
     * @default '<svg></svg>'
     */
    iconProcess?: string;
    /**
     * The icon used for retry actions.
     * @default '<svg></svg>'
     */
    iconRetry?: string;
    /**
     * The icon used for undo actions.
     * @default '<svg></svg>'
     */
    iconUndo?: string;
}

interface FilePondErrorDescription {
    main: string;
    sub: string;
}

/** Exposed for type filtering in downstream packages, please ignore. */
export interface FilePondCallbackProps {
    /** FilePond instance has been created and is ready. */
    oninit?: () => void;
    /**
     * FilePond instance throws a warning. For instance
     * when the maximum amount of files has been reached.
     * Optionally receives file if error is related to a
     * file object.
     */
    onwarning?: (error: any, file?: File, status?: any) => void;
    /**
     * FilePond instance throws an error. Optionally receives
     * file if error is related to a file object.
     */
    onerror?: (error: FilePondErrorDescription, file?: File, status?: any) => void;
    /** Started file load. */
    onaddfilestart?: (file: File) => void;
    /** Made progress loading a file. */
    onaddfileprogress?: (file: File, progress: number) => void;
    /** If no error, file has been successfully loaded. */
    onaddfile?: (error: FilePondErrorDescription | null, file: File) => void;
    /** Started processing a file. */
    onprocessfilestart?: (file: File) => void;
    /** Made progress processing a file. */
    onprocessfileprogress?: (file: File, progress: number) => void;
    /** Aborted processing of a file. */
    onprocessfileabort?: (file: File) => void;
    /** Processing of a file has been reverted. */
    onprocessfilerevert?: (file: File) => void;
    /** If no error, Processing of a file has been completed. */
    onprocessfile?: (error: FilePondErrorDescription | null, file: File) => void;
    /** Called when all files in the list have been processed. */
    onprocessfiles?: () => void;
    /** File has been removed. */
    onremovefile?: (error: FilePondErrorDescription | null, file: File) => void;
    /**
     * File has been transformed by the transform plugin or
     * another plugin subscribing to the prepare_output filter.
     * It receives the file item and the output data.
     */
    onpreparefile?: (file: File, output: any) => void;
    /** A file has been added or removed, receives a list of file items. */
    onupdatefiles?: (files: File[]) => void;
    /* Called when a file is clicked or tapped. **/
    onactivatefile?: (file: File) => void;
}

interface FilePondHookProps {
    /**
     * FilePond is about to allow this item to be dropped, it can be a URL or a File object.
     * 
     * Return `true` or `false` depending on if you want to allow the item to be dropped.
     */
    beforeDropFile?: (file: File | string) => boolean;
    /**
     * FilePond is about to add this file. 
     * 
     * Return `false` to prevent adding it, or return a `Promise` and resolve with `true` or `false`.
     */
    beforeAddFile?: (item: File) => boolean | Promise<boolean>;
    /**
     * FilePond is about to remove this file. 
     * 
     * Return `false` to prevent adding it, or return a `Promise` and resolve with `true` or `false`.
     */
    beforeRemoveFile?: (item: File) => boolean | Promise<boolean>;
}

interface FilePondStyleProps {
    /** 
     * Set a different layout render mode.
     * @default null
     */
    stylePanelLayout?: 'integrated' | 'compact' | 'circle';
    /**
     * Set a forced aspect ratio for the FilePond drop area.
     * 
     * Accepts human readable aspect ratios like `1:1` or numeric aspect ratios like `0.75`.
     * @default null
     */
    stylePanelAspectRatio?: string;
    /**
     * Set a forced aspect ratio for the file items. 
     * 
     * Useful when rendering cropped or fixed aspect ratio images in grid view.
     * @default null
     */
    styleItemPanelAspectRatio?: string;
    /** 
     * The position of the remove item button.
     * @default 'left'
     */
    styleButtonRemoveItemPosition?: string;
    /**
     * The position of the remove item button.
     * @default 'right' 
     */
    styleButtonProcessItemPosition?: string;
    /**
     * The position of the load indicator.
     * @default 'right'
     */
    styleLoadIndicatorPosition?: string;
    /**
     * The position of the progress indicator.
     * @default 'right'
     */
    styleProgressIndicatorPosition?: string;
}

type CaptureAttribute = "camera" | "microphone" | "camcorder";

interface FilePondBaseProps {
    /** 
     * The ID to add to the root element.
     * @default null
     */
    id?: string;
    /**
     * The input field name to use.
     * @default 'filepond'
     */
    name?: string;
    /** 
     * Class Name to put on wrapper.
     * @default null
     */
    className?: string;
    /** 
     * Sets the required attribute to the output field.
     * @default false
     */
    required?: boolean;
    /**
     * Sets the disabled attribute to the output field.
     * @default false
     */
    disabled?: boolean;
    /** 
     * Sets the given value to the capture attribute.
     * @default null
     */
    captureMethod?: CaptureAttribute;

    /** 
     * Enable or disable drag n’ drop.
     * @default true
     */
    allowDrop?: boolean;
    /** 
     * Enable or disable file browser.
     * @default true
     */
    allowBrowse?: boolean;
    /**
     * Enable or disable pasting of files. Pasting files is not
     * supported on all browsers.
     * @default true
     */
    allowPaste?: boolean;
    /** 
     * Enable or disable adding multiple files.
     * @default false
     */
    allowMultiple?: boolean;
    /** 
     * Allow drop to replace a file, only works when allowMultiple is false.
     * @default true
     */
    allowReplace?: boolean;
    /** 
     * Allows the user to revert file upload.
     * @default true
     */
    allowRevert?: boolean;
    /** 
     * Allows the user to reorder the file items
     * @default false
     */
    allowReorder?: boolean;
    /** 
     * Require the file to be successfully reverted before continuing.
     * @default false
     */
    forceRevert?: boolean;

    /** 
     * The maximum number of files that filepond pond can handle.
     * @default null
     */
    maxFiles?: number;
    /** 
     * Enables custom validity messages.
     * @default false
     */
    checkValidity?: boolean;

    /**
     * Set to false to always add items to beginning or end of list.
     * @default true
     */
    itemInsertLocationFreedom?: boolean;
    /**
     * Default index in list to add items that have been dropped at the top of the list.
     * @default 'before'
     */
    itemInsertLocation?: 'before' | 'after' | ((a: File, b: File) => number);
    /**
     * The interval to use before showing each item being added to the list.
     * @default 75
     */
    itemInsertInterval?: number;

    /** 
     * The maximum number of files that can be uploaded in parallel.
     * @default null
     */
    maxParallelUploads?: number;
}

export interface FilePondOptionProps extends
    FilePondDragDropProps,
    FilePondServerConfigProps,
    FilePondLabelProps,
    FilePondSvgIconProps,
    FilePondCallbackProps,
    FilePondHookProps,
    FilePondStyleProps,
    FilePondBaseProps { }

type FilePondEventPrefixed = 'FilePond:init'
    | 'FilePond:warning'
    | 'FilePond:error'
    | 'FilePond:addfilestart'
    | 'FilePond:addfileprogress'
    | 'FilePond:addfile'
    | 'FilePond:processfilestart'
    | 'FilePond:processfileprogress'
    | 'FilePond:processfileabort'
    | 'FilePond:processfilerevert'
    | 'FilePond:processfile'
    | 'FilePond:removefile'
    | 'FilePond:updatefiles';

type FilePondEvent = 'init'
    | 'warning'
    | 'error'
    | 'addfilestart'
    | 'addfileprogress'
    | 'addfile'
    | 'processfilestart'
    | 'processfileprogress'
    | 'processfileabort'
    | 'processfilerevert'
    | 'processfile'
    | 'removefile'
    | 'updatefiles';

export class FilePond {
    /**
     * The root element of the Filepond instance.
     */
    readonly element: Element | null;
    /**
     * Returns the current status of the FilePond instance.
     * @default Status.EMPTY
     */
    readonly status: Status;

    /** 
     * The ID to add to the root element.
     * @default null
     */
    id: string | null;
    /**
     * The input field name to use.
     * @default 'filepond'
     */
    name: string;
    /** 
     * Class Name to put on wrapper.
     * @default null
     */
    className: string | null;
    /** 
     * Sets the required attribute to the output field.
     * @default false
     */
    required: boolean;
    /**
     * Sets the disabled attribute to the output field.
     * @default false
     */
    disabled: boolean;
    /** 
     * Sets the given value to the capture attribute.
     * @default null
     */
    captureMethod: CaptureAttribute | null;

    /** 
     * Enable or disable drag n’ drop.
     * @default true
     */
    allowDrop: boolean;
    /** 
     * Enable or disable file browser.
     * @default true
     */
    allowBrowse: boolean;
    /**
     * Enable or disable pasting of files. Pasting files is not
     * supported on all browsers.
     * @default true
     */
    allowPaste: boolean;
    /** 
     * Enable or disable adding multiple files.
     * @default false
     */
    allowMultiple: boolean;
    /** 
     * Allow drop to replace a file, only works when allowMultiple is false.
     * @default true
     */
    allowReplace: boolean;
    /** 
     * Allows the user to revert file upload.
     * @default true
     */
    allowRevert: boolean;
    /** 
     * Require the file to be successfully reverted before continuing.
     * @default false
     */
    forceRevert: boolean;

    /** 
     * The maximum number of files that filepond pond can handle.
     * @default null
     */
    maxFiles: number | null;
    /** 
     * Enables custom validity messages.
     * @default false
     */
    checkValidity: boolean;

    /**
     * Set to false to always add items to beginning or end of list.
     * @default true
     */
    itemInsertLocationFreedom: boolean;
    /**
     * Default index in list to add items that have been dropped at the top of the list.
     * @default 'before'
     */
    itemInsertLocation: 'before' | 'after' | ((a: File, b: File) => number);
    /**
     * The interval to use before showing each item being added to the list.
     * @default 75
     */
    itemInsertInterval: number;

    /** 
     * The maximum number of files that can be uploaded in parallel.
     * @default null
     */
    maxParallelUploads: number | null;

    /**
     * Enable or disable chunked uploads
     * @default false
     */
    chunkUploads: boolean;

    /**
     * Force use of chunk uploads even for files smaller than chunk size
     * @default false
     */
    chunkForce: boolean;

    /**
     * Size of chunks (5MB default)
     * @default 5000000
     */
    chunkSize: number | string;

    /**
     * Amount of times to retry upload of a chunk when it fails
     * @default [500, 1000, 3000]
     */
    chunkRetryDelays: number[];

    /** 
     * FilePond will catch all files dropped on the webpage.
     * @default false
     */
    dropOnPage: boolean;
    
    /** 
     * Require drop on the FilePond element itself to catch the file.
     * @default true
     */
    dropOnElement: boolean;

    /**
     * When enabled, files are validated before they are dropped.
     * A file is not added when it’s invalid.
     * @default false
     */
    dropValidation: boolean;

    /**
     * Ignored file names when handling dropped directories.
     * Dropping directories is not supported on all browsers.
     * @default ['.ds_store', 'thumbs.db', 'desktop.ini']
     */
    ignoredFiles: string[];


    /** 
     * Server API Configuration.
     * See: https://pqina.nl/filepond/docs/patterns/api/server
     * @default null
     */
    server?: string | {
        url?: string
        timeout?: number
        headers?: { [key: string]: string | boolean | number } | null;
        process?: string | ServerUrl | ProcessServerConfigFunction | null;
        revert?: string | ServerUrl | RevertServerConfigFunction | null;
        restore?: string | ServerUrl | RestoreServerConfigFunction | null;
        load?: string | ServerUrl | LoadServerConfigFunction | null;
        fetch?: string | ServerUrl | FetchServerConfigFunction | null;
        remove?: RemoveServerConfigFunction | null;
    } | null;

    /** 
     * Immediately upload new files to the server.
     * @default true
     */
    instantUpload?: boolean;
    /**
     * A list of file locations that should be loaded immediately.
     * See: https://pqina.nl/filepond/docs/patterns/api/filepond-object/#setting-initial-files
     * @default []
     */
    files?: Array<FilePondInitialFile | ActualFileObject | Blob | string>;

    /**
     * The decimal separator used to render numbers.
     * By default this is determined automatically.
     * @default 'auto'
     */
    labelDecimalSeparator: string;
    /**
     * The thousands separator used to render numbers.
     * By default this is determined automatically.
     * @default 'auto'
     */
    labelThousandsSeparator: string;
    /**
     * Default label shown to indicate this is a drop area.
     * FilePond will automatically bind browse file events to
     * the element with CSS class .filepond--label-action.
     * @default 'Drag & Drop your files or <span class="filepond--label-action"> Browse </span>'
     */
    labelIdle: string;
    /** 
     * Label shown when the field contains invalid files and is validated by the parent form.
     * @default 'Field contains invalid files'
     */
    labelInvalidField: string;
    /** 
     * Label used while waiting for file size information.
     * @default 'Waiting for size'
     */
    labelFileWaitingForSize: string;
    /** 
     * Label used when no file size information was received.
     * @default 'Size not available'
     */
    labelFileSizeNotAvailable: string;
    /**
     * Label used when showing the number of files and there is only one.
     * @default 'file in list'
     */
    labelFileCountSingular: string;
    /**
     * Label used when showing the number of files and there is more than one.
     * @default 'files in list'
     */
    labelFileCountPlural: string;
    /** 
     * Label used while loading a file.
     * @default 'Loading'
     */
    labelFileLoading: string;
    /** 
     * Label used when file load failed.
     * @default 'Error during load'
     */
    labelFileLoadError: string;
    /** 
     * Label used when uploading a file.
     * @default 'Uploading'
     */
    labelFileProcessing: string;
    /** 
     * Label used when file upload has completed.
     * @default 'Upload complete'
     */
    labelFileProcessingComplete: string;
    /** 
     * Label used when upload was cancelled.
     * @default 'Upload cancelled'
     */
    labelFileProcessingAborted: string;
    /** 
     * Label used when something went wrong during file upload.
     * @default 'Error during upload'
     */
    labelFileProcessingError: string;
    /** 
     * Label used when something went wrong during reverting the file upload.
     * @default 'Error during revert'
     */
    labelFileProcessingRevertError: string;
    /** 
     * Label used when something went during during removing the file upload.
     * @default 'Error during remove'
     */
    labelFileRemoveError: string;
    /** 
     * Label used to indicate to the user that an action can be cancelled.
     * @default 'tap to cancel'
     */
    labelTapToCancel: string;
    /** 
     * Label used to indicate to the user that an action can be retried.
     * @default 'tap to retry'
     */
    labelTapToRetry: string;
    /** 
     * Label used to indicate to the user that an action can be undone.
     * @default 'tap to undo'
     */
    labelTapToUndo: string;
    /** 
     * Label used for remove button.
     * @default 'Remove'
     */
    labelButtonRemoveItem: string;
    /** 
     * Label used for abort load button.
     * @default 'Abort'
     */
    labelButtonAbortItemLoad: string;
    /** 
     * Label used for retry load.
     * @default 'Retry'
     */
    labelButtonRetryItemLoad: string;
    /** 
     * Label used for abort upload button.
     * @default 'Cancel'
     */
    labelButtonAbortItemProcessing: string;
    /** 
     * Label used for undo upload button.
     * @default 'Undo'
     */
    labelButtonUndoItemProcessing: string;
    /** 
     * Label used for retry upload button.
     * @default 'Retry'
     */
    labelButtonRetryItemProcessing: string;
    /** 
     * Label used for upload button.
     * @default 'Upload'
     */
    labelButtonProcessItem: string;

    /** 
     * The icon used for remove actions.
     * @default '<svg></svg>'
     */
    iconRemove: string;
    /** 
     * The icon used for process actions.
     * @default '<svg></svg>'
     */
    iconProcess: string;
    /** 
     * The icon used for retry actions.
     * @default '<svg></svg>'
     */
    iconRetry: string;
    /** 
     * The icon used for undo actions.
     * @default '<svg></svg>'
     */
    iconUndo: string;

    /** FilePond instance has been created and is ready. */
    oninit?: () => void;
    /**
     * FilePond instance throws a warning. For instance
     * when the maximum amount of files has been reached.
     * Optionally receives file if error is related to a
     * file object.
     */
    onwarning?: (error: any, file?: File, status?: any) => void;
    /**
     * FilePond instance throws an error. Optionally receives
     * file if error is related to a file object.
     */
    onerror?: (file?: File, error?: FilePondErrorDescription, status?: any) => void;
    /** Started file load. */
    onaddfilestart?: (file: File) => void;
    /** Made progress loading a file. */
    onaddfileprogress?: (file: File, progress: number) => void;
    /** If no error, file has been successfully loaded. */
    onaddfile?: (file: File, error?: FilePondErrorDescription) => void;
    /** Started processing a file. */
    onprocessfilestart?: (file: File) => void;
    /** Made progress processing a file. */
    onprocessfileprogress?: (file: File, progress: number) => void;
    /** Aborted processing of a file. */
    onprocessfileabort?: (file: File) => void;
    /** Processing of a file has been reverted. */
    onprocessfilerevert?: (file: File) => void;
    /** If no error, Processing of a file has been completed. */
    onprocessfile?: (file: File, error?: FilePondErrorDescription) => void;
    /** Called when all files in the list have been processed. */
    onprocessfiles?: () => void;
    /** File has been removed. */
    onremovefile?: (file: File, error?: FilePondErrorDescription) => void;
    /**
     * File has been transformed by the transform plugin or
     * another plugin subscribing to the prepare_output filter.
     * It receives the file item and the output data.
     */
    onpreparefile?: (file: File, output: any) => void;
    /** A file has been added or removed, receives a list of file items. */
    onupdatefiles?: (fileItems: File[]) => void;
    /* Called when a file is clicked or tapped. **/
    onactivatefile?: (file: File) => void;

    /**
     * FilePond is about to allow this item to be dropped, it can be a URL or a File object.
     * 
     * Return `true` or `false` depending on if you want to allow the item to be dropped.
     */
    beforeDropFile?: (file: File | string) => boolean;
    /**
     * FilePond is about to add this file. 
     * 
     * Return `false` to prevent adding it, or return a `Promise` and resolve with `true` or `false`.
     */
    beforeAddFile?: (item: File) => boolean | Promise<boolean>;
    /**
     * FilePond is about to remove this file. 
     * 
     * Return `false` to prevent adding it, or return a `Promise` and resolve with `true` or `false`.
     */
    beforeRemoveFile?: (item: File) => boolean | Promise<boolean>;

    /** 
     * Set a different layout render mode.
     * @default null
     */
    stylePanelLayout: 'integrated' | 'compact' | 'circle' | null;
    /**
     * Set a forced aspect ratio for the FilePond drop area.
     * 
     * Accepts human readable aspect ratios like `1:1` or numeric aspect ratios like `0.75`.
     * @default null
     */
    stylePanelAspectRatio: string | null;
    /**
     * Set a forced aspect ratio for the file items. 
     * 
     * Useful when rendering cropped or fixed aspect ratio images in grid view.
     * @default null
     */
    styleItemPanelAspectRatio: string | null;
    /** 
     * The position of the remove item button.
     * @default 'left'
     */
    styleButtonRemoveItemPosition: string;
    /**
     * The position of the remove item button.
     * @default 'right' 
     */
    styleButtonProcessItemPosition: string;
    /**
     * The position of the load indicator.
     * @default 'right'
     */
    styleLoadIndicatorPosition: string;
    /**
     * The position of the progress indicator.
     * @default 'right'
     */
    styleProgressIndicatorPosition: string;

    /** Override multiple options at once. */
    setOptions: (options: FilePondOptionProps) => void;
    /** 
     * Adds a file.
     * @param options.index The index that the file should be added at.
     */
    addFile: (source: ActualFileObject | Blob | string, options?: { index: number }) => Promise<File>;
    /** 
     * Adds multiple files.
     * @param options.index The index that the files should be added at.
     */
    addFiles: (source: ActualFileObject[] | Blob[] | string[], options?: { index: number }) => Promise<File[]>;
    /** 
     * Moves a file. Select file with query and supply target index. 
     * @param query The file reference, id, or index.
     * @param index The index to move the file to.
     */
    moveFile: (query: File | string | number, index: number) => void;
    /** 
     * Removes a file. If no parameter is provided, removes the first file in the list.
     * @param query The file reference, id, or index.
     */
    removeFile: (query?: File | string | number) => void;
    /** Removes all files. */
    removeFiles: () => void;
    /** 
     * Processes a file. If no parameter is provided, processes the first file in the list.
     * @param query The file reference, id, or index
     */
    processFile: (query?: File | string | number) => Promise<File>;
    /**
     * Processes multiple files. If no parameter is provided, processes all files.
     * @param query The file reference(s), id(s), or index(es)
     */
    processFiles: (query?: File[] | string[] | number[]) => Promise<File[]>;
    /** 
     * Returns a file. If no parameter is provided, returns the first file in the list.
     * @param query The file id, or index
     */
    getFile: (query?: string | number) => File;
    /** Returns all files. */
    getFiles: () => File[];
    /**
     * Manually trigger the browse files panel.
     * 
     * Only works if the call originates from the user.
     */
    browse: () => void;
    /**
     * Sort the items in the files list.
     * @param compare The comparison function
     */
    sort: (compare: (a: File, b: File) => number) => void;
    /** Destroys this FilePond instance. */
    destroy: () => void;

    /** Inserts the FilePond instance after the supplied element. */
    insertAfter: (element: Element) => void;
    /** Inserts the FilePond instance before the supplied element. */
    insertBefore: (element: Element) => void;
    /** Appends FilePond to the given element.  */
    appendTo: (element: Element) => void;
    /** Returns true if the current instance is attached to the supplied element. */
    isAttachedTo: (element: Element) => void;
    /** Replaces the supplied element with FilePond. */
    replaceElement: (element: Element) => void;
    /** If FilePond replaced the original element, this restores the original element to its original glory. */
    restoreElement: (element: Element) => void;

    /** 
     * Adds an event listener to the given event.
     * @param event Name of the event, prefixed with `Filepond:`
     * @param fn Event handler
     */
    addEventListener: (event: FilePondEventPrefixed, fn: (e: any) => void) => void;
    /** 
     * Listen to an event.
     * @param event Name of the event
     * @param fn Event handler, signature is identical to the callback method
     */
    on: (event: FilePondEvent, fn: (...args: any[]) => void) => void;
    /** 
     * Listen to an event once and remove the handler.
     * @param event Name of the event
     * @param fn Event handler, signature is identical to the callback method
     */
    onOnce: (event: FilePondEvent, fn: (...args: any[]) => void) => void;
    /** 
     * Stop listening to an event.
     * @param event Name of the event
     * @param fn Event handler, signature is identical to the callback method
     */
    off: (event: FilePondEvent, fn: (...args: any[]) => void) => void;
}

/** Creates a new FilePond instance. */
export function create(element?: Element, options?: FilePondOptionProps): FilePond;
/** Destroys the FilePond instance attached to the supplied element. */
export function destroy(element: Element): void;
/** Returns the FilePond instance attached to the supplied element. */
export function find(element: Element): FilePond;
/**
 * Parses a given section of the DOM tree for elements with class
 * .filepond and turns them into FilePond elements.
 */
export function parse(context: Element): void;
/** Registers a FilePond plugin for later use. */
export function registerPlugin(...plugins: any[]): void;
/** Sets page level default options for all FilePond instances. */
export function setOptions(options: FilePondOptionProps): void;
/** Returns the current default options. */
export function getOptions(): FilePondOptionProps;
/** Determines whether or not the browser supports FilePond. */
export function supported(): boolean;
/** Returns an object describing all the available options and their types, useful for writing FilePond adapters. */
export const OptionTypes: object;

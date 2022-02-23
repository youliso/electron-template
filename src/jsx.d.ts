/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * License: MIT
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/tsx-dom
 */

type ComponentChild = ComponentChild[] | JSX.Element | string | number | boolean | undefined | null;
type ComponentChildren = ComponentChild | ComponentChild[];
interface BaseProps {
  children?: ComponentChildren;
}
type ComponentFactory = (props: BaseProps) => JSX.Element;
type ComponentAttributes = {
  [s: string]:
    | string
    | number
    | boolean
    | undefined
    | null
    | Partial<CSSStyleDeclaration>
    | EventListenerOrEventListenerObject;
};

declare namespace JSX {
  // Return type of jsx syntax
  type Element = HTMLElement;

  // specify the property/children name to use
  interface ElementAttributesProperty {
    props: any;
  }
  interface ElementChildrenAttribute {
    children: any;
  }

  type EventHandler<TEvent extends Event> = (this: HTMLElement, ev: TEvent) => void;

  type ClipboardEventHandler = EventHandler<ClipboardEvent>;
  type CompositionEventHandler = EventHandler<CompositionEvent>;
  type DragEventHandler = EventHandler<DragEvent>;
  type FocusEventHandler = EventHandler<FocusEvent>;
  type KeyboardEventHandler = EventHandler<KeyboardEvent>;
  type MouseEventHandler = EventHandler<MouseEvent>;
  type TouchEventHandler = EventHandler<TouchEvent>;
  type UIEventHandler = EventHandler<UIEvent>;
  type WheelEventHandler = EventHandler<WheelEvent>;
  type AnimationEventHandler = EventHandler<AnimationEvent>;
  type TransitionEventHandler = EventHandler<TransitionEvent>;
  type GenericEventHandler = EventHandler<Event>;
  type PointerEventHandler = EventHandler<PointerEvent>;

  interface DOMAttributes {
    children?: ComponentChildren[] | ComponentChildren;

    // Image Events
    onLoad?: GenericEventHandler;
    onLoadCapture?: GenericEventHandler;
    onError?: GenericEventHandler;
    onErrorCapture?: GenericEventHandler;

    // Clipboard Events
    onCopy?: ClipboardEventHandler;
    onCopyCapture?: ClipboardEventHandler;
    onCut?: ClipboardEventHandler;
    onCutCapture?: ClipboardEventHandler;
    onPaste?: ClipboardEventHandler;
    onPasteCapture?: ClipboardEventHandler;

    // Composition Events
    onCompositionEnd?: CompositionEventHandler;
    onCompositionEndCapture?: CompositionEventHandler;
    onCompositionStart?: CompositionEventHandler;
    onCompositionStartCapture?: CompositionEventHandler;
    onCompositionUpdate?: CompositionEventHandler;
    onCompositionUpdateCapture?: CompositionEventHandler;

    // Details Events
    onToggle?: GenericEventHandler;

    // Focus Events
    onFocus?: FocusEventHandler;
    onFocusCapture?: FocusEventHandler;
    onBlur?: FocusEventHandler;
    onBlurCapture?: FocusEventHandler;

    // Form Events
    onChange?: GenericEventHandler;
    onChangeCapture?: GenericEventHandler;
    onInput?: GenericEventHandler;
    onInputCapture?: GenericEventHandler;
    onSearch?: GenericEventHandler;
    onSearchCapture?: GenericEventHandler;
    onSubmit?: GenericEventHandler;
    onSubmitCapture?: GenericEventHandler;
    onInvalid?: GenericEventHandler;
    onInvalidCapture?: GenericEventHandler;
    onReset?: GenericEventHandler;
    onResetCapture?: GenericEventHandler;
    onFormData?: GenericEventHandler;
    onFormDataCapture?: GenericEventHandler;

    // Keyboard Events
    onKeyDown?: KeyboardEventHandler;
    onKeyDownCapture?: KeyboardEventHandler;
    onKeyPress?: KeyboardEventHandler;
    onKeyPressCapture?: KeyboardEventHandler;
    onKeyUp?: KeyboardEventHandler;
    onKeyUpCapture?: KeyboardEventHandler;

    // Media Events
    onAbort?: GenericEventHandler;
    onAbortCapture?: GenericEventHandler;
    onCanPlay?: GenericEventHandler;
    onCanPlayCapture?: GenericEventHandler;
    onCanPlayThrough?: GenericEventHandler;
    onCanPlayThroughCapture?: GenericEventHandler;
    onDurationChange?: GenericEventHandler;
    onDurationChangeCapture?: GenericEventHandler;
    onEmptied?: GenericEventHandler;
    onEmptiedCapture?: GenericEventHandler;
    onEncrypted?: GenericEventHandler;
    onEncryptedCapture?: GenericEventHandler;
    onEnded?: GenericEventHandler;
    onEndedCapture?: GenericEventHandler;
    onLoadedData?: GenericEventHandler;
    onLoadedDataCapture?: GenericEventHandler;
    onLoadedMetadata?: GenericEventHandler;
    onLoadedMetadataCapture?: GenericEventHandler;
    onLoadStart?: GenericEventHandler;
    onLoadStartCapture?: GenericEventHandler;
    onPause?: GenericEventHandler;
    onPauseCapture?: GenericEventHandler;
    onPlay?: GenericEventHandler;
    onPlayCapture?: GenericEventHandler;
    onPlaying?: GenericEventHandler;
    onPlayingCapture?: GenericEventHandler;
    onProgress?: GenericEventHandler;
    onProgressCapture?: GenericEventHandler;
    onRateChange?: GenericEventHandler;
    onRateChangeCapture?: GenericEventHandler;
    onSeeked?: GenericEventHandler;
    onSeekedCapture?: GenericEventHandler;
    onSeeking?: GenericEventHandler;
    onSeekingCapture?: GenericEventHandler;
    onStalled?: GenericEventHandler;
    onStalledCapture?: GenericEventHandler;
    onSuspend?: GenericEventHandler;
    onSuspendCapture?: GenericEventHandler;
    onTimeUpdate?: GenericEventHandler;
    onTimeUpdateCapture?: GenericEventHandler;
    onVolumeChange?: GenericEventHandler;
    onVolumeChangeCapture?: GenericEventHandler;
    onWaiting?: GenericEventHandler;
    onWaitingCapture?: GenericEventHandler;

    // MouseEvents
    onClick?: MouseEventHandler;
    onClickCapture?: MouseEventHandler;
    onContextMenu?: MouseEventHandler;
    onContextMenuCapture?: MouseEventHandler;
    onDblClick?: MouseEventHandler;
    onDblClickCapture?: MouseEventHandler;
    onDrag?: DragEventHandler;
    onDragCapture?: DragEventHandler;
    onDragEnd?: DragEventHandler;
    onDragEndCapture?: DragEventHandler;
    onDragEnter?: DragEventHandler;
    onDragEnterCapture?: DragEventHandler;
    onDragExit?: DragEventHandler;
    onDragExitCapture?: DragEventHandler;
    onDragLeave?: DragEventHandler;
    onDragLeaveCapture?: DragEventHandler;
    onDragOver?: DragEventHandler;
    onDragOverCapture?: DragEventHandler;
    onDragStart?: DragEventHandler;
    onDragStartCapture?: DragEventHandler;
    onDrop?: DragEventHandler;
    onDropCapture?: DragEventHandler;
    onMouseDown?: MouseEventHandler;
    onMouseDownCapture?: MouseEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseEnterCapture?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
    onMouseLeaveCapture?: MouseEventHandler;
    onMouseMove?: MouseEventHandler;
    onMouseMoveCapture?: MouseEventHandler;
    onMouseOut?: MouseEventHandler;
    onMouseOutCapture?: MouseEventHandler;
    onMouseOver?: MouseEventHandler;
    onMouseOverCapture?: MouseEventHandler;
    onMouseUp?: MouseEventHandler;
    onMouseUpCapture?: MouseEventHandler;

    // Selection Events
    onSelect?: GenericEventHandler;
    onSelectCapture?: GenericEventHandler;

    // Touch Events
    onTouchCancel?: TouchEventHandler;
    onTouchCancelCapture?: TouchEventHandler;
    onTouchEnd?: TouchEventHandler;
    onTouchEndCapture?: TouchEventHandler;
    onTouchMove?: TouchEventHandler;
    onTouchMoveCapture?: TouchEventHandler;
    onTouchStart?: TouchEventHandler;
    onTouchStartCapture?: TouchEventHandler;

    // Pointer Events
    onPointerOver?: PointerEventHandler;
    onPointerOverCapture?: PointerEventHandler;
    onPointerEnter?: PointerEventHandler;
    onPointerEnterCapture?: PointerEventHandler;
    onPointerDown?: PointerEventHandler;
    onPointerDownCapture?: PointerEventHandler;
    onPointerMove?: PointerEventHandler;
    onPointerMoveCapture?: PointerEventHandler;
    onPointerUp?: PointerEventHandler;
    onPointerUpCapture?: PointerEventHandler;
    onPointerCancel?: PointerEventHandler;
    onPointerCancelCapture?: PointerEventHandler;
    onPointerOut?: PointerEventHandler;
    onPointerOutCapture?: PointerEventHandler;
    onPointerLeave?: PointerEventHandler;
    onPointerLeaveCapture?: PointerEventHandler;
    onGotPointerCapture?: PointerEventHandler;
    onGotPointerCaptureCapture?: PointerEventHandler;
    onLostPointerCapture?: PointerEventHandler;
    onLostPointerCaptureCapture?: PointerEventHandler;

    // UI Events
    onScroll?: UIEventHandler;
    onScrollCapture?: UIEventHandler;

    // Wheel Events
    onWheel?: WheelEventHandler;
    onWheelCapture?: WheelEventHandler;

    // Animation Events
    onAnimationStart?: AnimationEventHandler;
    onAnimationStartCapture?: AnimationEventHandler;
    onAnimationEnd?: AnimationEventHandler;
    onAnimationEndCapture?: AnimationEventHandler;
    onAnimationIteration?: AnimationEventHandler;
    onAnimationIterationCapture?: AnimationEventHandler;

    // Transition Events
    onTransitionEnd?: TransitionEventHandler;
    onTransitionEndCapture?: TransitionEventHandler;
  }

  interface HTMLAttributes extends DOMAttributes {
    // Standard HTML Attributes
    accept?: string;
    acceptCharset?: string;
    accessKey?: string;
    action?: string;
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    alt?: string;
    as?: string;
    async?: boolean;
    autocomplete?: string;
    autoComplete?: string;
    autocorrect?: string;
    autoCorrect?: string;
    autofocus?: boolean;
    autoFocus?: boolean;
    autoPlay?: boolean;
    capture?: boolean | string;
    cellPadding?: number | string;
    cellSpacing?: number | string;
    charSet?: string;
    challenge?: string;
    checked?: boolean;
    class?: string;
    // className?: string;
    cols?: number;
    colSpan?: number;
    content?: string;
    contentEditable?: boolean;
    contextMenu?: string;
    controls?: boolean;
    controlsList?: string;
    coords?: string;
    crossOrigin?: string;
    data?: string;
    dateTime?: string;
    default?: boolean;
    defer?: boolean;
    dir?: 'auto' | 'rtl' | 'ltr';
    disabled?: boolean;
    disableRemotePlayback?: boolean;
    download?: string;
    draggable?: boolean;
    encType?: string;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    frameBorder?: number | string;
    headers?: string;
    height?: number | string;
    hidden?: boolean;
    high?: number;
    href?: string;
    hrefLang?: string;
    for?: string;
    htmlFor?: string;
    httpEquiv?: string;
    icon?: string;
    id?: string;
    inputMode?: string;
    integrity?: string;
    is?: string;
    keyParams?: string;
    keyType?: string;
    kind?: string;
    label?: string;
    lang?: string;
    list?: string;
    loading?: 'eager' | 'lazy';
    loop?: boolean;
    low?: number;
    manifest?: string;
    marginHeight?: number;
    marginWidth?: number;
    max?: number | string;
    maxLength?: number;
    media?: string;
    mediaGroup?: string;
    method?: string;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    muted?: boolean;
    name?: string;
    nonce?: string;
    noValidate?: boolean;
    open?: boolean;
    optimum?: number;
    pattern?: string;
    placeholder?: string;
    playsInline?: boolean;
    poster?: string;
    preload?: string;
    radioGroup?: string;
    readOnly?: boolean;
    rel?: string;
    required?: boolean;
    role?: string;
    rows?: number;
    rowSpan?: number;
    sandbox?: string;
    scope?: string;
    scoped?: boolean;
    scrolling?: string;
    seamless?: boolean;
    selected?: boolean;
    shape?: string;
    size?: number;
    sizes?: string;
    slot?: string;
    span?: number;
    spellcheck?: boolean;
    src?: string;
    srcset?: string;
    srcDoc?: string;
    srcLang?: string;
    srcSet?: string;
    start?: number;
    step?: number | string;
    style?: string | Partial<CSSStyleDeclaration>;
    summary?: string;
    tabIndex?: number;
    target?: string;
    title?: string;
    type?: string;
    useMap?: string;
    value?: string | string[] | number;
    volume?: string | number;
    width?: number | string;
    wmode?: string;
    wrap?: string;

    // RDFa Attributes
    about?: string;
    datatype?: string;
    inlist?: boolean;
    prefix?: string;
    property?: string;
    resource?: string;
    typeof?: string;
    vocab?: string;

    // Microdata Attributes
    itemProp?: string;
    itemScope?: boolean;
    itemType?: string;
    itemID?: string;
    itemRef?: string;
  }

  type IntrinsicElementsHTML = { [TKey in keyof HTMLElementTagNameMap]?: HTMLAttributes };

  type IntrinsicElements = IntrinsicElementsHTML;
}

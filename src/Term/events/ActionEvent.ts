class ActionEvent {
  public readonly action: string;
  public readonly data?: any;
  public readonly target?: HTMLElement | HTMLElement[]
    | { [key: string]: HTMLElement | HTMLElement[] };

  constructor(
    params: {
      action: string;
      data?: any;
      target?: HTMLElement | HTMLElement[]
        | { [key: string]: HTMLElement | HTMLElement[] };
    },
  ) {
    this.action = params.action;
    this.data = params.data;
    this.target = params.target;
  }
}

export default ActionEvent;

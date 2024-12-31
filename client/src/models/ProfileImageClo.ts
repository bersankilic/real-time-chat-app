export class ProfileImageClo {
  private _upload_preset: string;
  private _file: File | undefined;
  private _folder: string;

  constructor(
    file: File | undefined,
    upload_preset: string = "ts4tmsay",
    folder: string = "chat_profiles"
  ) {
    this._file = file;
    this._folder = folder;
    this._upload_preset = upload_preset;
  }

  get upload_preset(): string {
    return this._upload_preset;
  }

  set upload_preset(value: string) {
    this._upload_preset = value;
  }

  get file(): File | undefined {
    return this._file;
  }

  set file(value: File | undefined) {
    this._file = value;
  }

  get folder(): string {
    return this._folder;
  }

  set folder(value: string) {
    this._folder = value;
  }

}

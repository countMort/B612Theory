export class Category {
  constructor(
    public _id: _ID,
    public name: string,
    public value: string,
    public photos: string[],
    public thumbnails: string[],
    public products: _ID[]
  ) {}
}

export type _ID = string

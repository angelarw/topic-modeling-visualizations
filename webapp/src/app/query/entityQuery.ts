export class EntityQuery {

  constructor(
    public text: string = '',
    public limit: number = 10,
  ) { }

  get terms() {
    return this.text.split(',').map(s => s.trim());
  }
}

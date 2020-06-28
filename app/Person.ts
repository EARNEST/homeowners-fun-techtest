export class Person {
  title: string;
  initial?: string;
  first_name?: string;
  last_name: string;

  constructor(
    title: string,
    last_name: string,
    initial?: string,
    first_name?: string,
  ) {
    this.title = title;
    this.last_name = last_name;
    this.initial = initial;
    this.first_name = first_name;
  }

  public toString(): string{
    const parts = [
      this.title,
      this.first_name,
      this.initial,
      this.last_name
    ];

    return parts.filter(p => p !== undefined).join(" ");
  }
}

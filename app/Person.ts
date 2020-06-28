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
}

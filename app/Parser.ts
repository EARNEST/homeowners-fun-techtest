import { Person } from "./Person";

export class Parser {
  private readonly splitterRegex = /\&|\sand\s|\,/g;
  private readonly initialRegex = /^(?<initial>.{1})\.{0,1}$/;

  public parse(rawValue: string): Person[] {
    if (rawValue.length === 0) {
      return [];
    }

    const people = rawValue
      .split(this.splitterRegex)
      .map((v) =>
        v
          .trim()
          .split(" ")
          .filter((v) => v.length !== 0)
      )
      .map((parts) => this.toPerson(parts));

    this.fillInLastNameWhereMissing(people);

    return people;
  }

  private toPerson(parts: string[]): Person {
    const title = this.getTitle(parts);
    const lastName = this.getLastName(parts);
    const firstName = this.getFirstName(parts);
    const initial = this.getInitial(parts);

    return new Person(title, lastName, initial, firstName);
  }

  private fillInLastNameWhereMissing(people: Person[]): void {
    // can use better ways, but this will do
    [...people].reverse().reduce((prev, curr) => {
      if (curr.last_name === "") {
        curr.last_name = prev.last_name;
        return prev;
      }

      return curr;
    });
  }

  private getTitle(parts: string[]): string {
    return parts[0];
  }

  private getLastName(parts: string[]): string {
    return parts.length > 1 ? parts[parts.length - 1] : "";
  }

  private getFirstName(parts: string[]): string | undefined {
    const nameParts = this.getOptionals(parts).filter(
      (v) => !this.isInitial(v)
    );
    if (nameParts.length === 0) {
      return undefined;
    }

    return nameParts.join(" ");
  }

  private getInitial(parts: string[]): string | undefined {
    const initials = this.getOptionals(parts).filter((v) => this.isInitial(v));
    if (initials.length === 0) {
      return undefined;
    }

    if (initials.length > 1) {
      throw "Incorrect parsing of initials";
    }

    return initials[0].replace(".", "");
  }

  private getOptionals(parts: string[]): string[] {
    return [...parts].splice(1, parts.length - 2);
  }

  private isInitial(value: string): boolean {
    return value.match(this.initialRegex) != null;
  }
}

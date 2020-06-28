import { Person } from "./Person";

export class Parser {
  private readonly splitters: string[] = ["&", "and", ","];
  private readonly splitterRegex = /\&|\sand\s|\,/g;
  private readonly initialRegex = /^(?<initial>.{1})\.{0,1}$/;

  public parse(rawValue: string): Person[] {
    if (rawValue.length === 0) {
      return [];
    }

    const values = rawValue
      .split(this.splitterRegex)
      .map((v) =>
        v
          .trim()
          .split(" ")
          .filter((v) => v.length !== 0)
      )
      .reverse()
      .map((parts) => this.toPerson(parts));

    values.reduce((prev, curr) => {
      if (curr.last_name === "") {
        curr.last_name = prev.last_name;
        return prev;
      }

      return curr;
    });

    return values.reverse();
  }

  private toPerson(parts: string[]) {
    const title = this.getTitle(parts);
    const lastName = this.getLastName(parts);
    const firstName = this.getFirstName(parts);
    const initial = this.getInitial(parts);

    return new Person(title, lastName, initial, firstName);
  }

  private getTitle(parts: string[]): string {
    return parts[0];
  }

  private getLastName(parts: string[]): string {
    return parts.length > 1 ? parts[parts.length - 1] : "";
  }

  private getFirstName(parts: string[]): string | undefined {
    const optionals = [...parts].splice(1, parts.length - 2);
    const nameParts = optionals.filter((v) => !this.isInitial(v));

    if (nameParts.length === 0) {
      return undefined;
    }

    return nameParts.join(" ");
  }

  private getInitial(parts: string[]): string | undefined {
    const optionals = [...parts].splice(1, parts.length - 2);
    const initials = optionals.filter((v) => this.isInitial(v));

    if (initials.length === 0) {
      return undefined;
    }

    if (initials.length > 1) {
      throw "Incorrect parsing of initials";
    }

    return initials[0].replace(".", "");
  }

  private isInitial(value: string): boolean {
    return value.match(this.initialRegex) != null;
  }
}

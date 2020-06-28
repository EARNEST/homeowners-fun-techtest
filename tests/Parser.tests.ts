import { Parser } from "../app/Parser";
import { expect } from "chai";
import itParam from "mocha-param";
import { Person } from "../app/Person";

describe("Given an empty value", () => {
  it("should parse to empty array of people", () => {
    const sut = new Parser();

    const people = sut.parse("");

    expect(people).to.be.empty;
  });
});

describe("Given a format for a single person", () => {
  const singleMappings = [
    {
      raw: "Mr John Smith",
      data: new Person("Mr", "Smith", undefined, "John"),
    },
    {
      raw: "Father Carl Keith F. Davidson",
      data: new Person("Father", "Davidson", "F", "Carl Keith"),
    },
    {
      raw: "Captain Doe",
      data: new Person("Captain", "Doe", undefined, undefined),
    },
    {
      raw: "Dr P Gunn",
      data: new Person("Dr", "Gunn", "P", undefined),
    },
    {
      raw: "Lt. Alex F. Hughes-Eastwood",
      data: new Person("Lt.", "Hughes-Eastwood", "F", "Alex"),
    },
  ];

  itParam(
    "should parse format '${value.raw}' to person schema",
    singleMappings,
    (mapping) => {
      const sut = new Parser();

      const people = sut.parse(mapping.raw);

      expect(people.length).to.eq(1, "Must parse to a single person");
      expect(people[0]).to.eql(mapping.data);
    }
  );
});

describe("Given a format for multiple people", () => {
  const multiMappings = [
    {
      raw: "Mr,Dr &Father and Captain Marvel",
      data: [
        new Person("Mr", "Marvel", undefined, undefined),
        new Person("Dr", "Marvel", undefined, undefined),
        new Person("Father", "Marvel", undefined, undefined),
        new Person("Captain", "Marvel", undefined, undefined),
      ],
    },
    {
      raw: "Mrs and Mr Marsh",
      data: [
        new Person("Mrs", "Marsh", undefined, undefined),
        new Person("Mr", "Marsh", undefined, undefined),
      ],
    },
    {
      raw: "Mr Alex Trebek and Mr. T Doe",
      data: [
        new Person("Mr", "Trebek", undefined, "Alex"),
        new Person("Mr.", "Doe", "T", undefined),
      ],
    },
    {
      raw: "Mr Tom Nick F. Staff, Mrs & Father Joe Cole",
      data: [
        new Person("Mr", "Staff", "F", "Tom Nick"),
        new Person("Mrs", "Cole", undefined, undefined),
        new Person("Father", "Cole", undefined, "Joe"),
      ],
    },
    {
      raw: "Mr and Mrs Smith",
      data: [
        new Person("Mr", "Smith", undefined, undefined),
        new Person("Mrs", "Smith", undefined, undefined),
      ],
    },
    {
      raw: "Dr&Mrs Joa Bloggs",
      data: [
        new Person("Dr", "Bloggs", undefined, undefined),
        new Person("Mrs", "Bloggs", undefined, "Joa"),
      ],
    },
  ];

  itParam(
    "should parse format '${value.raw}' to multi-person schema",
    multiMappings,
    (mapping) => {
      const sut = new Parser();
      const people = sut.parse(mapping.raw);

      expect(people.length).to.be.greaterThan(
        1,
        "Must parse to multple people"
      );

      expect(people).to.eql(mapping.data);
    }
  );
});

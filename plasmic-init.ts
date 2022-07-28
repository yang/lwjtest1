import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import {Collapse, Section} from "./components";
import {
    DataTable,
    TableColumn,
    TableValue, RestQuery
} from "./components/AppBuilding";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "5CT2KQ1Xt5NXny22ZLGJPP",
      token: "S4KJoXWaBxtULSht8hJejL5SE10sb9wrJiaXXT1SguqniN1UIeGFA6ygnYuo3RMkIFqvUmpG2p57Syq5Fw",
    },
  ],

  // By default Plasmic will use the last published version of your project.
  // For development, you can set preview to true, which will use the unpublished
  // project, allowing you to see your designs without publishing.  Please
  // only use this for development, as this is significantly slower.
  preview: true,
});

// You can register any code components that you want to use here; see
// https://docs.plasmic.app/learn/code-components-ref/
// And configure your Plasmic project to use the host url pointing at
// the /plasmic-host page of your nextjs app (for example,
// http://localhost:3000/plasmic-host).  See
// https://docs.plasmic.app/learn/app-hosting/#set-a-plasmic-project-to-use-your-app-host

PLASMIC.registerComponent(
    Section,
    {
      name: "Section",
      props: {
        children: 'slot',
        hideHeading: 'boolean',
      }
    }
);

PLASMIC.registerComponent(
    Collapse,
    {
      name: "Collapse",
      props: {
          title: {
              type: 'slot',
              defaultValue: "This is the title"
          },
          children: {
              type: 'slot',
              defaultValue: "This is the body"
          },
          forceShown: "boolean",
      }
    }
);


function capitalizeFirstLetter(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

const DEFAULT_ITEMS = [
    {
        name: "John Brown",
        age: 19,
        address: "New York No. 1 Lake Park",
        tags: ["student", "developer"],
    },
    {
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["teacher"],
    },
    {
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
    },
];

PLASMIC.registerComponent(DataTable, {
    name: "DataTable",
    props: {
        items: {
            type: "array",
            defaultValue: DEFAULT_ITEMS,
        },

        columns: {
            type: "slot",
            allowedComponents: ["TableColumn"],
            defaultValue: Object.keys(DEFAULT_ITEMS[0]).map((columnName) => ({
                type: "component",
                name: "TableColumn",
                props: {
                    title: capitalizeFirstLetter(columnName),
                    dataIndex: columnName,
                },
            })) as any,
        },
    },
});

PLASMIC.registerComponent(TableColumn, {
    name: "TableColumn",
    parentComponentName: "DataTable",
    providesData: true,
    props: {
        // The title text to show in the column headers
        title: {
            type: "string",
            defaultValue: "Name",
        },

        // The path for the data field to get the value from
        // Display field of the data record, support nest path by string array
        dataIndex: {
            type: "string",
            defaultValue: "name",
        },

        // TODO: Debug why the ctx object is empty (expected to be ctx = {tableColumn})
        // dataIndex: {
        //   type: "dataSelector",
        //   data: (props, ctx) => {
        //     console.log(">>> M dataSelector", {props, ctx});
        //     return ctx?.tableColumns ?? {}}
        //     ,
        //   displayName: "Field",
        //   description: "Field to be displayed.",
        //   defaultValue: ["name"],
        // },

        // Plasmic - Custom column template
        columnTemplate: {
            type: "slot",
            defaultValue: {
                type: "vbox",
                styles: {
                    padding: 0,
                },
                children: [
                    {
                        type: "component",
                        name: "TableValue",
                    },
                ],
            },
        } as any,
    },
});

PLASMIC.registerComponent(TableValue, {
    name: "TableValue",
    parentComponentName: "TableColumn",
    props: {},
});

PLASMIC.registerComponent(RestQuery, {
    name: "RestQuery",
    providesData: true,
    props: {
        url: {
            type: "string",
            defaultValue: "https://jsonplaceholder.typicode.com/posts"
        },
        method: {
            type: 'choice',
            options: [
                'GET',
                'POST'
            ],
            defaultValueHint: 'GET'
        },
        children: {
            type: 'slot',
            defaultValue: [
                {
                    type: 'vbox',
                    children: [
                        {
                            type: 'text',
                            value: 'Insert some contents here'
                        }
                    ]
                }
            ]
        }
    },
});
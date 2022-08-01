export const TEMPLATES: ReadonlyArray<ProjectTemplate> = [
  {
    type: 'Project Template',
    name: 'Name Change',
    prerequisites: [
      {
        type: 'Prerequisite',
        name: 'Choose a Name',
        dataNeeded: [
          {
            type: 'Data Requirement',
            variable: {
              name: 'Your new name',
              type: 'string',
            },
            sourceOptions: [
              {
                type: 'Source Option',
                sourceType: 'Manual Input',
              },
              {
                type: 'Source Option',
                sourceType: 'Other Project',
                projectName: 'Choose a Name',
              },
            ],
          },
        ],
      },
    ],
    modules: [
      {
        name: 'Choose Name Change Types',
        moduleType: 'Select Other Modules',
        description:
          'Choose which domain(s) of name change you want to focus on for now.',
        submodules: [
          {
            name: 'Social Name Change',
            description:
              'Choose which context(s) or group(s) of people you want to use your new name in for now.',
            moduleType: 'List of User-Defined Submodules using Template',
            submoduleTemplate: {
              name: 'Social Name Change: {{context}}',
              description: 'Use your new name: {{context}}.',
              moduleType: 'Readiness Gradient',
              gradient: [
                {
                  name: 'Journal',
                  description:
                    'Journal about using your new name: {{context}}.',
                  moduleType: 'Journal',
                },
                {
                  name: 'Talk about it',
                  description:
                    'Talk to someone you trust about using your new name: {{context}}.',
                  moduleType: 'Talk',
                },
                {
                  name: 'Share it',
                  description:
                    'Share your new name and ask people to use it: {{context}}.',
                  moduleType: 'Action',
                  followup: [
                    {
                      delay: {
                        amount: 1,
                        unit: 'week',
                      },
                      followupType: 'Review',
                    },
                  ],
                },
              ],
              arguments: [
                {
                  name: 'context',
                  type: 'string',
                },
              ],
            },
            options: [
              {
                variables: [
                  {
                    name: 'context',
                    type: 'string',
                    value: 'family',
                  },
                ],
              },
              {
                variables: [
                  { name: 'context', type: 'string', value: 'friends' },
                ],
              },
              {
                variables: [
                  { name: 'context', type: 'string', value: 'coworkers' },
                ],
              },
              {
                variables: [
                  { name: 'context', type: 'string', value: 'other' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

type ProjectTemplate = Readonly<{
  type: 'Project Template';
  name: string;
  prerequisites?: ReadonlyArray<Prerequisite>;
  modules: ReadonlyArray<Module>;
}>;

type Module = Readonly<{
  name: string;
  description: string;
  arguments?: ReadonlyArray<Variable>;
}> &
  (
    | Readonly<{
        moduleType: 'Select Other Modules';
        submodules: ReadonlyArray<Module>;
      }>
    | Readonly<{
        moduleType: 'List of User-Defined Submodules using Template';
        submoduleTemplate: Module;
        options: ReadonlyArray<
          Readonly<{
            variables: ReadonlyArray<VariableWithValue>;
          }>
        >;
      }>
    | Readonly<{
        moduleType: 'Readiness Gradient';
        gradient: ReadonlyArray<Module>;
      }>
    | Readonly<{
        moduleType: 'Journal' | 'Talk';
      }>
    | Readonly<{
        moduleType: 'Action';
        followup: ReadonlyArray<Followup>;
      }>
  );

type Followup = Readonly<{
  delay: Duration;
  followupType: 'Review';
}>;

type Duration = Readonly<{
  amount: number;
  unit: 'day' | 'week' | 'month' | 'year';
}>;

type InterfaceElement = Readonly<{
  type: 'Interface Element';
}>;

type Action = Readonly<{
  actionType: 'Append Module';
  moduleName: string;
  arguments: ReadonlyArray<string>;
}>;

type Prerequisite = Readonly<{
  type: 'Prerequisite';
  name: string;
  dataNeeded: ReadonlyArray<PrerequisiteDataRequirement>;
}>;

type Variable = Readonly<{
  name: string;
  type: string;
}>;

type VariableWithValue = Variable & { value: unknown };

type PrerequisiteDataRequirement = Readonly<{
  type: 'Data Requirement';
  variable: Variable;
  sourceOptions: ReadonlyArray<PrerequisiteDataRequirementSourceOption>;
}>;

type PrerequisiteDataRequirementSourceOption =
  | Readonly<{
      type: 'Source Option';
      sourceType: 'Manual Input';
    }>
  | Readonly<{
      type: 'Source Option';
      sourceType: 'Other Project';
      projectName: string;
    }>;

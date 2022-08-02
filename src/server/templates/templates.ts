export const TEMPLATES: ReadonlyArray<ProjectTemplate> = [
  {
    type: 'Project Template',
    name: 'Name Change',
    prerequisites: [
      {
        name: 'Choose a Name',
        dataNeeded: [
          {
            variable: {
              name: 'Your new name',
              type: 'string',
            },
            sourceOptions: [
              {
                sourceType: 'Manual Input',
              },
              {
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
        name: 'Choose Name Change Domains',
        moduleType: 'Select Other Modules',
        description:
          'Choose which domain(s) of name change you want to focus on for now.',
        choices: [
          {
            name: 'Social Name Change',
            description:
              'Choose which context(s) or group(s) of people you want to use your new name in for now.',
            notes:
              'The term "Social Name Change" is commonly used to refer to ' +
              'when you ask people to use your new name when talking to you or talking about you.',
            moduleType: 'User-Defined List',
            listElement: {
              arguments: [
                {
                  name: 'context',
                  type: 'string',
                },
              ],
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
                    'Share your new name in the <{{context}}> context.',
                  moduleType: 'Parallel',
                  submodules: [
                    {
                      name: 'Share it with individuals',
                      description:
                        'Make a list of people in the <{{context}}> context who you want to share your name with',
                      moduleType: 'User-Defined List',
                      listElement: {
                        arguments: [
                          {
                            name: 'person',
                            type: 'string',
                          },
                        ],
                        name: 'Share your new name with {{person}}',
                        description:
                          'Share your new name in the <{{context}}> context with {{person}}.',
                        moduleType: 'AtomicTask',
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
                      options: [
                        {
                          variables: [
                            {
                              name: 'person',
                              type: 'string',
                              other: true,
                              prompt:
                                'Enter the name of a person in the <{{context}}> who ' +
                                "you'd like to share your new name with",
                            },
                          ],
                        },
                      ],
                    },
                  ],
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
                  {
                    name: 'context',
                    type: 'string',
                    other: true,
                    prompt:
                      'Enter the name of a different context where youd like to share your new name',
                  },
                ],
              },
            ],
          },
          // Legal Name Change (court order, social security, drivers license, passport, birth certificate)
          // Change Name on your Accounts (e.g., bank, gym, phone plan, doctor's office)
          // Custom Domain (e.g., school, work, public persona)
        ],
      },
    ],
  },
];

/**
 * A project template is an object that a user can upload to the "Template Marketplace",
 * which other users can then use to create a project
 */
type ProjectTemplate = Readonly<{
  type: 'Project Template';
  name: string;
  prerequisites?: ReadonlyArray<Prerequisite>;
  modules: ReadonlyArray<Module>;
}>;

type ModuleBase = Readonly<{
  name: string;
  description: string;
  notes?: string;
  arguments?: ReadonlyArray<Variable>;
}>;

type SelectOtherModulesModule = Readonly<{
  moduleType: 'Select Other Modules';
  choices: ReadonlyArray<Module>;
}>;

type UserDefinedListModule = Readonly<{
  moduleType: 'User-Defined List';
  listElement: ModuleWithArguments;
  options: ReadonlyArray<
    Readonly<{
      variables: ReadonlyArray<VariableWithValue>;
    }>
  >;
}>;

type ReadinessGradientModule = Readonly<{
  moduleType: 'Readiness Gradient';
  gradient: ReadonlyArray<Module>;
}>;

type JournalModule = Readonly<{ moduleType: 'Journal' }>;

type TalkModule = Readonly<{ moduleType: 'Talk' }>;

type AtomicTaskModule = Readonly<{
  moduleType: 'AtomicTask';
  followup?: ReadonlyArray<Followup>;
}>;

type ParallelModule = Readonly<{
  moduleType: 'Parallel';
  submodules: ReadonlyArray<Module>;
}>;

type Module = ModuleBase &
  (
    | SelectOtherModulesModule
    | UserDefinedListModule
    | ReadinessGradientModule
    | JournalModule
    | TalkModule
    | AtomicTaskModule
    | ParallelModule
  );

type ModuleWithArguments = Module & {
  arguments: NonNullable<ModuleBase['arguments']>;
};

/**
 * For followups, we'll ask the user what they think about
 * the outcome of the task, and prompt them to decide whether to
 * archive it, start over, add a new task, or remind them to do it again later.
 *
 * This is useful when they can complete a task "atomically", but
 * may not see the downstream consequences until later.
 */
type Followup = Readonly<{
  delay: Duration;
  followupType: 'Review';
}>;

type Duration = Readonly<{
  amount: number;
  unit: 'day' | 'week' | 'month' | 'year';
}>;

type Prerequisite = Readonly<{
  name: string;
  dataNeeded: ReadonlyArray<PrerequisiteDataRequirement>;
}>;

type Variable = Readonly<{
  name: string;
  type: string;
}>;

type VariableWithValue = Readonly<
  Variable & ({ value: unknown } | { other: true; prompt: string })
>;

type PrerequisiteDataRequirement = Readonly<{
  variable: Variable;
  sourceOptions: ReadonlyArray<PrerequisiteDataRequirementSourceOption>;
}>;

type PrerequisiteDataRequirementSourceOption =
  | Readonly<{
      sourceType: 'Manual Input';
    }>
  | Readonly<{
      sourceType: 'Other Project';
      projectName: string;
    }>;

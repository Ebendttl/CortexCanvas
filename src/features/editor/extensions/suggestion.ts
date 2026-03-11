import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Type, 
  List, 
  ListTodo, 
  Code, 
  Image as ImageIcon,
  Table as TableIcon,
  Sparkles
} from 'lucide-react'

export const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      icon: Heading1,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 1 })
          .run()
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      icon: Heading2,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 2 })
          .run()
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      icon: Heading3,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 3 })
          .run()
      },
    },
    {
      title: 'Text',
      description: 'Just start writing with plain text.',
      icon: Type,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('paragraph')
          .run()
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bulleted list.',
      icon: List,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleBulletList()
          .run()
      },
    },
    {
      title: 'Todo List',
      description: 'Track tasks with a todo list.',
      icon: ListTodo,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleTaskList()
          .run()
      },
    },
    {
      title: 'Code Block',
      description: 'Capture code with syntax highlighting.',
      icon: Code,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleCodeBlock()
          .run()
      },
    },
    {
        title: 'Table',
        description: 'Insert a 3x3 table.',
        icon: TableIcon,
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        },
      },
    {
      title: 'AI Draft',
      description: 'Let AI help you write or brainstorm.',
      icon: Sparkles,
      command: ({ editor, range }: any) => {
        // This will be handled by the AI integration
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .run()
        
        // Trigger AI modal or command
        console.log('AI Command Triggered')
      },
    },
  ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
}

import { Inbox } from 'lucide-react'
import { Card, CardContent } from './ui/Card'

export const EmptyState = ({ message = 'No data available', icon: Icon = Inbox }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}


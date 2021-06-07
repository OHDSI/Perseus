import { IComment } from '@models/comment';

export function commentsForReport(comments: IComment[]): string {
  return (comments || [])
    .filter(comment => comment.active)
    .map(comment => comment.text)
    .join('\n');
}

import { IComment } from '@models/comment';

export function commentsForReport(comments: IComment[]): string {
  if (!comments || comments.length === 0) {
    return ''
  }
  return comments[0].text
}

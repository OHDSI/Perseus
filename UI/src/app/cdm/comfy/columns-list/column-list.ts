export function getPositionStrategy(element: HTMLElement, listHalfHeight: number, listTop: number) {
  const {top} = element.getBoundingClientRect();
  const relativeTop = top - listTop

  return listHalfHeight > relativeTop ? 'top' : 'bottom';
}

import { ColCondition, Column, OperatorType } from "@/components/Table/table.type";
import { get } from "lodash";
import moment from "moment-jalaali";

const checkTableCellCondition = (value: number | string, conditions: ColCondition[] | undefined) => {
  if (value === null || value === undefined || value === "") return
  if (!conditions) return

  for (const condition of conditions) {
    const isMatch = compareValues<number | string | number[]>(value, condition.target, condition.operator)
    if (!!isMatch) return `${condition.className} p-2 rounded-md text-white`
  }
};



export function compareValues<T>(value1: T, value2: T, operator: OperatorType): boolean {
  switch (operator) {
    case 'equals':
      return value1 === value2;
    case 'contains':
      if (typeof value1 === 'string' && typeof value2 === 'string') {
        return value1.includes(value2);
      }
      return false;
    case 'lt':
      return value1 < value2;
    case 'lte':
      return value1 <= value2;
    case 'gt':
      return value1 > value2;
    case 'gte':
      return value1 >= value2;
    case 'not':
      return value1 !== value2;
    case 'between':
      const min = (value2 as number[])[0]
      const max = (value2 as number[])[1]
      if (!min || !max) return false
      return (value1 as number) >= min && (value1 as number) <= max
    default:
      return false;
  }
}
export default checkTableCellCondition;

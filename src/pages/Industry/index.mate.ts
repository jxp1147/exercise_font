import { Industry } from "@/services/industryApi";
import { TableColumnsType } from "antd";
export const columns: TableColumnsType<Industry> = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '行业名',
    dataIndex: 'industryName',
    key: 'industryName',
  },
]
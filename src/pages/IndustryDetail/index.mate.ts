import { Job } from '../../services/jobApi';
import { TableColumnsType } from "antd";
export const columns: TableColumnsType<Job> = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '岗位',
    dataIndex: 'jobName',
    key: 'jobName',
  },
]
import { getUsers, User } from '@/services';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { columns } from './index.mate';

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(()=>{
    getUsers().then(res=>{
      if (res.code === 200){
        setUsers(res.data.data);
      }
    })
  }, [])
  return (
    <div className='p-4'>
      <Table dataSource={users} columns={columns} rowKey="id"/>
    </div>
    
  );
};

export default HomePage;

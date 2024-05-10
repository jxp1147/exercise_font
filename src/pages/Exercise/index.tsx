import { addExerciseApi, IExercise, getExercisesByPageDataApi } from "@/services/exerciseApi";
import { FormItem, Input, Submit, Form } from "@formily/antd";
import { createForm } from "@formily/core";
import { createSchemaField } from "@formily/react";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { columns } from "./index.mate";
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
  },
})
const Exercise: React.FC = () => {
  const [refreshExercises, setRefreshExercises] = useState({});
  const addExerciseForm = createForm();
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const addExercise = async (exercise: IExercise) => {
    const response = await addExerciseApi(exercise);
    if (response.code === 200) {
      setRefreshExercises({})
    }

  }
  const exerciseColumns = [
    ...columns, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <a onClick={() => {
          setRefreshExercises({})
        }}>删除</a>
      ),
    }
  ]
  useEffect(() => {
    getExercisesByPageDataApi().then(res => {
      console.log(res);
      setExercises(res.data)
    })
  }, [refreshExercises])
  return (
    <div className='p-4'>
      <Table dataSource={exercises} columns={exerciseColumns} rowKey="id"/>
      <div>-----------------------------</div>
      <Form
        form={addExerciseForm}
        onAutoSubmit={addExercise}
        labelCol={4}
      >
        <SchemaField>
          <SchemaField.String
            name="exerciseContent"
            title="题目"
            required
            x-decorator="FormItem"
            x-component="Input"
            x-validator={{
              required: true,
            }}
            x-component-props={{
              placeholder: '输入行题目',
            }}
          />
          <SchemaField.String
            name="exerciseAnswer"
            title="参考答案"
            required
            x-decorator="FormItem"
            x-component="Input"
            x-validator={{
              required: true,
            }}
            x-component-props={{
              placeholder: '输入参考答案',
            }}
          />
      </SchemaField>
      <Submit block>
        添加
      </Submit>
    </Form>
    </div >
  );
};

export default Exercise;

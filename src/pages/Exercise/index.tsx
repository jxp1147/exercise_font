import { addExerciseApi, IExercise, getExercisesByPageDataApi } from "@/services/exerciseApi";
import { FormItem, Input, Submit, Form } from "@formily/antd";
import { createForm } from "@formily/core";
import { createSchemaField } from "@formily/react";
import { useEffect, useState } from "react";
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
  },
})
const Exercise: React.FC = () => {
  const [refreshExercises, setRefreshExercises] = useState({});
  const addExerciseForm = createForm();
  const addExercise = async (exercise: IExercise) => {
    const response = await addExerciseApi(exercise);
    if (response.code === 200) {
      setRefreshExercises({})
    }

  }
  useEffect(() => {
    getExercisesByPageDataApi().then(res => {
      console.log(res);
    })
  }, [refreshExercises])
  return (
    <div className='p-4'>

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

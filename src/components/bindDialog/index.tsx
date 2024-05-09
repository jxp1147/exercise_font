import { User } from '@/services';
import { getAllIndustriesApi, Industry } from '@/services/industryApi';
import { getJobsByIndustryIdApi, Job } from '@/services/jobApi';
import {
    Input,
    Form,
    FormItem,
    Submit,
    Select
} from '@formily/antd'
import { createForm, Field, FormPathPattern, onFieldReact } from '@formily/core';
import { useEffect, useState } from 'react';
import { createSchemaField } from '@formily/react';
import { action } from '@formily/reactive'
const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Select
    },
})


export const BindDialog = (props: {
    bind: (bindForm: User) => Promise<void>;
}) => {

    const { bind } = props;
    const [industries, setIndusties] = useState<Industry[]>([]);
    useEffect(() => {
        getAllIndustriesApi().then(res => {
            console.log(res);
            setIndusties(res.data);
        })
    }, [])
    const useAsyncGetJobsByIndustryId = (
        pattern: FormPathPattern,
        service: (field: Field) => Promise<{ label: string; value: number }[]>
      ) => {
        onFieldReact(pattern, (field: any) => {
          field.loading = true
          service(field).then(
            action.bound((data) => {
              field.dataSource = data
              field.loading = false
            })
          )
        })
      }
    const bindForm = createForm({
        effects: () => {
            useAsyncGetJobsByIndustryId('jobId', async (field) => { 
                const industryId = field.query('industryId').get('value');
                if (!industryId) return []
                return new Promise((resolve) => {
                    getJobsByIndustryIdApi(industryId).then((res) => {
                        resolve(res.data.map((job: Job) => ({
                            label: job.jobName,
                            value: job.id
                        })))
                    })
                })
            })
        }
    });
    return (
        <Form
        form={bindForm}
        onAutoSubmit={bind}
        labelCol={4}
    >
        <SchemaField>
            <SchemaField.String
                name="industryId"
                title="行业"
                required
                x-decorator="FormItem"
                x-component="Select"
                enum={industries.map((industry) => ({
                    label: industry.industryName,
                    value: industry.id,
                }))}
            />
             <SchemaField.String
                name="jobId"
                title="岗位"
                required
                x-decorator="FormItem"
                x-component="Select"
            />
        </SchemaField>
        <Submit block size="large">
            bind
        </Submit>
    </Form>
    );
};
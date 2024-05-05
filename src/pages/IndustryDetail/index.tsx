import { getIndustryByIdApi, updateIndustryApi } from "@/services/industryApi";
import { useEffect, useState } from "react";
import { useParams } from "umi";
import {
    Input,
    Form,
    FormItem,
    Submit,
} from '@formily/antd'
import { observer } from '@formily/reactive-react';
import { createForm } from "@formily/core";
import { createSchemaField } from '@formily/react';
import { addJobApi, deleteJobApi, getJobsByIndustryIdApi, Job, updateJobApi } from "@/services/jobApi";
import { Table } from "antd";
import { columns } from "./index.mate";
import React from "react";
const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
    },
})
const IndustryDetail: React.FC = () => {
    const id = useParams().id as string;
    const [refreshJobs, setRefreshJobs] = useState({});
    const [industryDetail, setIndustryDetail] = useState({});
    const [jobDetail, setJobDetail] = useState({});
    const [jobs, setJobs] = useState([]);
    const industryDetailForm = createForm({
        values: industryDetail,
    });

    const jobForm = createForm();
    const jobEditForm = createForm<Job>();
    
    const editRow = (record: Job) => {
        setJobDetail(record)
    }
    columns.push({
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
            <>
                <a onClick={() => {
                    deleteJobApi(record.id?.toString() as string).then(() => setRefreshJobs({}));
                }} className="mr-4">delete</a>
                <a onClick={() => {
                    editRow(record)
                }}>edit</a>
            </>
        ),
    });
    useEffect(()=> {
        jobEditForm.setValues({...jobDetail});
    }, [jobDetail])
    useEffect(() => {
        getIndustryByIdApi(id).then(res => {
            if (res.code === 200) {
                setIndustryDetail(res.data)
                industryDetailForm.setValues(res.data);
            }
        })
        getJobsByIndustryIdApi(id).then(res => {
            if (res.code === 200) {
                setJobs(res.data)
            }
        })
    }, [id, refreshJobs])

    const editIndustry = (values: any) => {
        updateIndustryApi(values);
    }
    const addJob = (values: any) => {
        values.industryId = id;
        addJobApi(values).then((res) => {
            if (res.code === 200) {
                setRefreshJobs({});
            }
        });
    }

    const editJob = (values: any) => {
        console.log('jobEditForm.getFormState().values.id', jobEditForm)
        const job = {
            id: jobEditForm.getFormState().values.id,
            jobName: values.jobName,
        }
        updateJobApi(job as Job).then((res) => {
            if (res.code === 200) {
                setRefreshJobs({});
            }
        });
    }
    return (
        <div className="p-4">
            <Form

                form={industryDetailForm}
                onAutoSubmit={editIndustry}
                labelCol={4}
            >
                <SchemaField>
                    <SchemaField.String
                        name="industryName"
                        title="行业名"
                        required
                        x-decorator="FormItem"
                        x-component="Input"
                        x-validator={{
                            required: true,
                        }}
                        x-component-props={{
                            placeholder: '输入行业名',
                        }}
                    />
                </SchemaField>
                <Submit block>
                    修改
                </Submit>
            </Form>
            <div className="mt-4">
                <Table dataSource={jobs} columns={columns} rowKey="id" />
            </div>
            <div className="w-30 mt-4">
                <Form
                    form={jobForm}
                    onAutoSubmit={addJob}
                    labelCol={4}
                >
                    <SchemaField>
                        <SchemaField.String
                            name="jobName"
                            title="岗位"
                            required
                            x-decorator="FormItem"
                            x-component="Input"
                            x-validator={{
                                required: true,
                            }}
                            x-component-props={{
                                placeholder: '输入岗位名',
                            }}
                        />
                    </SchemaField>
                    <Submit block>
                        添加
                    </Submit>
                </Form>
            </div>
            --------------------------------------------------------------------

            <div className="w-30 mt-4">
                <Form
                    form={jobEditForm}
                    onAutoSubmit={editJob}
                    labelCol={4}
                >
                    <SchemaField>
                        <SchemaField.String
                            name="jobName"
                            title="岗位"
                            required
                            x-decorator="FormItem"
                            x-component="Input"
                            x-validator={{
                                required: true,
                            }}
                            x-component-props={{
                                placeholder: '输入岗位名',
                            }}
                        />
                    </SchemaField>
                    <Submit block>
                        修改
                    </Submit>
                </Form>
            </div>
        </div>
    );
}

export default IndustryDetail;
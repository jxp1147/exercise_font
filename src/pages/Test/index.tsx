import { IExercise, getExercisesByPageDataApi, getExerciseByIdApi, answerExerciseApi } from "@/services/exerciseApi";
import { Button, Input } from 'antd';
const { TextArea } = Input;
import { Table } from "antd";
import { useEffect, useState } from "react";
import { columns } from "../Exercise/index.mate";
import { createSchemaField } from "@formily/react";
import { FormItem, Form, Submit } from "@formily/antd";
import { createForm } from "@formily/core";
const SchemaField = createSchemaField({
    components: {
        FormItem,
        TextArea,
    },
})
const answerCoreForm = createForm();
const Test: React.FC = () => {
    const [refreshExercises, setRefreshExercises] = useState({});
    const [exercises, setExercises] = useState<IExercise[]>([]);
    const [exerciseId, setExerciseId] = useState<string>();
    const [exercise, setExercise] = useState<IExercise>();
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
            setExerciseId(res.data[0].id)
        })
    }, [refreshExercises])

    useEffect(() => {
        if (exerciseId) {
            getExerciseByIdApi(exerciseId).then(res => {
                setExercise(res.data);
            })
        }
    }, [exerciseId])
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const [gptText, setGptText] = useState('');
    const [gptIndex, setGptIndex] = useState(0);
    const [showGptAnswer, setShowGptAnswer] = useState(false);
    const [gptGenderAnswer, setGptGenderAnswer] = useState('');
    const answerExercise = () => {
        setShowAnswer(true);
        const userAnswer = answerCoreForm.values.userAnswer;
        const answerForm = new FormData();
        answerForm.append('answer', userAnswer);
        answerForm.append('exerciseId', exerciseId as string);
        answerExerciseApi(answerForm).then(res => {
            if (res.code === 200) {
                if (index === (exercise?.exerciseAnswer as string).length) {
                    setShowGptAnswer(true)
                }
                console.log(res);
                setGptGenderAnswer(res.data)
            }
        })
    }
    useEffect(() => {
        const text = exercise?.exerciseAnswer || '';
        let answerTimer: NodeJS.Timeout;
        if (index < text.length) {
            answerTimer = setTimeout(() => {
                if (showAnswer) {
                    setDisplayText(prevText => prevText + text.charAt(index));
                    setIndex(prevIndex => prevIndex + 1);
                } 
            }, 20);
        } else {
            if (answerTimer) {
                clearTimeout(answerTimer)
            }
            setShowGptAnswer(true)
        }
    }, [index, exercise?.exerciseAnswer, showAnswer]);

    useEffect(() => {
        let gptAnswerTimer: NodeJS.Timeout;
        if (showGptAnswer && gptIndex < gptGenderAnswer.length) {
            setTimeout(() => {
                setGptText(prevText => prevText + gptGenderAnswer.charAt(gptIndex));
                setGptIndex(prevIndex => prevIndex + 1);
            }, 20);
        } else {
            if (gptAnswerTimer) {
                clearTimeout(gptAnswerTimer);
            }
        }
    }, [gptIndex, gptGenderAnswer, showGptAnswer]);
    return (
        <div className='p-4 flex gap-10'>
            <div className="w-2/3">
                <h4 className="pb-4">{exercise?.exerciseContent}</h4>
                <div>
                    <Form form={answerCoreForm}>
                        <SchemaField>
                            <SchemaField.String
                                name="userAnswer"
                                required
                                x-decorator="FormItem"
                                x-component="TextArea"
                                x-validator={{
                                    required: true,
                                }}
                                x-component-props={{
                                    placeholder: '输入答案',
                                    rows: 10
                                }}
                            />
                        </SchemaField>
                        <div className="flex flex-row-reverse mt-4">
                            <Button type="primary" onClick={answerExercise}>确认</Button>
                        </div>
                    </Form>
                </div>
                <div>
                    <h5>参考答案：</h5>
                    {showAnswer && <div>{displayText}</div>}
                </div>
                <div>
                    <h5>gpt答案：</h5>
                    {showGptAnswer && <div>{gptText}</div>}
                </div>

            </div>
            <div className="w-1/3">
                <Table dataSource={exercises} columns={exerciseColumns} rowKey="id" />
            </div>
        </div >
    );
};

export default Test;

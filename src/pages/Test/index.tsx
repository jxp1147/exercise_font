import { IExercise, getExercisesByPageDataApi, getExerciseByIdApi, answerExerciseApi } from "@/services/exerciseApi";
import { Button, Input } from 'antd';
const { TextArea } = Input;
import { Table } from "antd";
import { useEffect, useState } from "react";
import { columns } from "../Exercise/index.mate";
import { createSchemaField } from "@formily/react";
import { FormItem, Form } from "@formily/antd";
import { createForm } from "@formily/core";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
const SchemaField = createSchemaField({
    components: {
        FormItem,
        TextArea,
    },
})
const answerCoreForm = createForm();
let gptAnswerTimer: NodeJS.Timeout;
let answerTimer: NodeJS.Timeout;
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
    const [btnDisabled, setBtnDisabled] = useState(false);
    const answerExercise = () => {
        setShowAnswer(true);
        setBtnDisabled(true);
        const userAnswer = answerCoreForm.values.userAnswer;
        const answerForm = new FormData();
        answerForm.append('answer', userAnswer);
        answerForm.append('exerciseId', exerciseId as string);
        answerExerciseApi(answerForm).then(res => {
            if (res.code === 200) {
                if (index === (exercise?.exerciseAnswer as string).length) {
                    setShowGptAnswer(true)
                }
                setGptGenderAnswer(res.data)
            }
        })
    }
    useEffect(() => {
        const text = exercise?.exerciseAnswer || '';
        if (index < text.length) {
            answerTimer = setTimeout(() => {
                if (showAnswer) {
                    setBtnDisabled(true);
                    setDisplayText(prevText => prevText + text.charAt(index));
                    setIndex(prevIndex => prevIndex + 1);
                }
            }, 20);
        } else {
            if (answerTimer) {
                clearTimeout(answerTimer)
                setBtnDisabled(false);
            }
            setShowGptAnswer(true)
        }
    }, [index, exercise?.exerciseAnswer, showAnswer]);

    const refreshShow = () =>{
        setShowAnswer(false);
        setShowGptAnswer(false);
        setGptGenderAnswer('');
        setDisplayText('');
        setGptText('');
        setGptIndex(0);
        setIndex(0);
        answerCoreForm.setValues({userAnswer: ' '});
    }

    const nextOne = () => {
        refreshShow();
        let nextIndex = exercises.findIndex(item => item.id === exerciseId);
        if (nextIndex === -1 || nextIndex === exercises.length - 1) {
            nextIndex = 0;
        } else {
            nextIndex++;
        }
        setExerciseId(exercises[nextIndex].id);
    }
    const preOne = () => {
        refreshShow();
        let preIndex = exercises.findIndex(item => item.id === exerciseId);
        if (preIndex === -1) {
            preIndex = 0;
        } else if (preIndex === 0) {
            preIndex = exercises.length - 1;
        } else {
            preIndex--;
        }
        setExerciseId(exercises[preIndex].id);
    }

    useEffect(() => {
        if (showGptAnswer && gptIndex < gptGenderAnswer.length) {
            gptAnswerTimer = setTimeout(() => {
                setBtnDisabled(true);
                setGptText(prevText => prevText + gptGenderAnswer.charAt(gptIndex));
                setGptIndex(prevIndex => prevIndex + 1);
            }, 20);
        } else {
            if (gptAnswerTimer) {
                setBtnDisabled(false);
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
                        <div className="flex flex-row-reverse gap-2 mt-4">
                            <Button type="primary" onClick={answerExercise} disabled = { btnDisabled }>确认</Button>
                            <Button type="primary" icon={<RightOutlined /> } disabled = { btnDisabled } onClick={nextOne}></Button>
                            <Button type="primary" icon={<LeftOutlined />} disabled = { btnDisabled } onClick={preOne}></Button>
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

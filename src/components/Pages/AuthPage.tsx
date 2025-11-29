import {Button, Card, Form, Input, Select, Typography, Alert, type FormInstance} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {useState, useRef, type FC} from "react";
import type {LoginRequest} from "../../models/DTOModels/Request/LoginRequest.ts";
import type {RegisterRequest} from "../../models/DTOModels/Request/RegisterRequest.ts";
import {UserRole} from "../../models/DTOModels/Еnums/UserRole.ts";
import {authApi} from "../../apis/authApi.ts";
import {hasValue} from "../../utils/hasValue.ts";
import {authLocalService} from "../../storageServices/authLocalService.ts";

const {Title} = Typography;

const AuthPage: FC = () => {
    const [activeForm, setActiveForm] = useState<'login' | 'register'>('login');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const formLoginRef = useRef<FormInstance<LoginRequest>>(null);
    const formRegisterRef = useRef<FormInstance<RegisterRequest & { confirmPassword: string }>>(null);

    const clearError = () => setError(null);

    const onFinishLogin = async (values: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authApi.login(values);
            if (hasValue(res.data)) {
                authLocalService.setIdentityData(res.data);
                window.location.href = '/ProjectsPage';
            } else if (hasValue(res.error)) setError('Неверное имя пользователя или пароль.')
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Ошибка авторизации';
            setError(errorMessage);
            if (err.response?.status === 401) {
                setError('Неверное имя пользователя или пароль.')
            }
        } finally {
            setLoading(false);
        }
    };

    const onFinishRegister = async (values: RegisterRequest & { confirmPassword: string }) => {
        setLoading(true);
        setError(null);
        try {
            const {confirmPassword, ...registerData} = values;
            const res = await authApi.register(registerData);
            if (hasValue(res.data?.successfully)) {
                setActiveForm('login');
                setTimeout(() => {
                    formLoginRef.current?.setFieldsValue({
                        userName: values.username,
                        password: values.password,
                    });
                }, 0);
            } else if (hasValue(res.error)) setError('Ошибка регистрации')
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Ошибка регистрации';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        {value: UserRole.Specialist, label: 'Специалист'},
        {value: UserRole.Administrator, label: 'Администратор'},
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f0f2f5'
        }}>
            <Card style={{width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
                <Title level={2} style={{textAlign: 'center', marginBottom: 24}}>
                    {activeForm === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
                </Title>
                {error && (
                    <Alert
                        description={error}
                        type="error"
                        showIcon
                        style={{marginBottom: 16}}
                        onClose={clearError}
                        closable
                    />
                )}
                {activeForm === 'login' ? (
                    <Form<LoginRequest>
                        ref={formLoginRef}
                        name="login"
                        onFinish={onFinishLogin}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name="UserName"
                            rules={[
                                {required: true, message: 'Введите имя пользователя!'},
                                {min: 3, message: 'Имя не менее 3 символов!'},
                                {max: 50, message: 'Имя слишком длинное!'},
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: 'Имя может содержать только буквы, цифры и подчёркивания!'
                                }
                            ]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder="Имя пользователя" size="large"/>
                        </Form.Item>
                        <Form.Item
                            name="Password"
                            rules={[
                                {required: true, message: 'Введите пароль!'},
                                {min: 6, message: 'Пароль не менее 6 символов!'},
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message: 'Пароль должен содержать заглавную букву, строчную и цифру!'
                                }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined/>} placeholder="Пароль" size="large"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                                Войти
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="link" onClick={() => {
                                setActiveForm('register');
                                clearError();
                            }} block style={{padding: 0}}>
                                Нет аккаунта? Зарегистрируйтесь
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <Form<RegisterRequest & { confirmPassword: string }>
                        ref={formRegisterRef}
                        name="register"
                        onFinish={onFinishRegister}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name="Username"
                            rules={[
                                {required: true, message: 'Введите имя пользователя!'},
                                {min: 3, message: 'Имя не менее 3 символов!'},
                                {max: 50, message: 'Имя слишком длинное!'},
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: 'Имя может содержать только буквы, цифры и подчёркивания!'
                                }
                            ]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder="Имя пользователя" size="large"/>
                        </Form.Item>
                        <Form.Item
                            name="FullName"
                            rules={[
                                {required: true, message: 'Введите полное имя!'},
                                {min: 2, message: 'Полное имя не менее 2 символов!'},
                                {max: 100, message: 'Полное имя слишком длинное!'},
                                {
                                    pattern: /^[a-zA-Zа-яА-Я\s]+$/,
                                    message: 'Полное имя может содержать только буквы и пробелы!'
                                }
                            ]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder="Полное имя" size="large"/>
                        </Form.Item>
                        <Form.Item
                            name="Role"
                            rules={[{required: true, message: 'Выберите роль!'}]}
                        >
                            <Select placeholder="Выберите роль" size="large" options={roleOptions}/>
                        </Form.Item>
                        <Form.Item
                            name="Password"
                            rules={[
                                {required: true, message: 'Введите пароль!'},
                                {min: 6, message: 'Пароль не менее 6 символов!'},
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message: 'Пароль должен содержать заглавную букву, строчную и цифру!'
                                }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined/>} placeholder="Пароль" size="large"/>
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            dependencies={['Password']}
                            rules={[
                                {required: true, message: 'Подтвердите пароль!'},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('Password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Пароли не совпадают!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined/>} placeholder="Подтвердите пароль" size="large"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                                Зарегистрироваться
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="link" onClick={() => {
                                setActiveForm('login');
                                clearError();
                            }} block style={{padding: 0}}>
                                Уже есть аккаунт? Войдите
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default AuthPage;

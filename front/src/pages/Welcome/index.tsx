import {
    ClusterOutlined,
    ContactsOutlined, FacebookOutlined,
    HomeOutlined, LinkedinOutlined,
    PlusOutlined,
    TwitterOutlined,
    YoutubeOutlined
} from '@ant-design/icons';
import {GridContent} from '@ant-design/pro-components';
import {Card, Divider, Flex, Image, Input, InputRef, Row, Tag} from 'antd';
import React, {useRef, useState} from 'react';
import useStyles from './Center.style';
import type {CurrentUser, TagType} from './data.d';

const TagList: React.FC<{
    tags: CurrentUser['tags'];
}> = ({tags}) => {
    const {styles} = useStyles();
    const ref = useRef<InputRef | null>(null);
    const [newTags, setNewTags] = useState<TagType[]>([]);
    const [inputVisible, setInputVisible] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const showInput = () => {
        setInputVisible(true);
        if (ref.current) {
            // eslint-disable-next-line no-unused-expressions
            ref.current?.focus();
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        let tempsTags = [...newTags];
        if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
            tempsTags = [
                ...tempsTags,
                {
                    key: `new-${tempsTags.length}`,
                    label: inputValue,
                },
            ];
        }
        setNewTags(tempsTags);
        setInputVisible(false);
        setInputValue('');
    };
    return (
        <div className={styles.tags}>
            <div className={styles.tagsTitle}>标签</div>
            {(tags || []).concat(newTags).map((item) => (
                <Tag key={item.key}>{item.label}</Tag>
            ))}
            {inputVisible && (
                <Input
                    ref={ref}
                    type="text"
                    size="small"
                    style={{
                        width: 78,
                    }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            )}
            {!inputVisible && (
                <Tag
                    onClick={showInput}
                    style={{
                        borderStyle: 'dashed',
                    }}
                >
                    <PlusOutlined/>
                </Tag>
            )}
        </div>
    );
};
const Center: React.FC = () => {
    const {styles} = useStyles();


    //  渲染用户信息
    const renderUserInfo = () => {
        return (
            <div className={styles.detail}>
                <p>
                    <ContactsOutlined
                        style={{
                            marginRight: 8,
                        }}
                    />
                    {"LuDan"}
                </p>
                <p>
                    <ClusterOutlined
                        style={{
                            marginRight: 8,
                        }}
                    />
                    个人独立创作者
                </p>
                <p>
                    <HomeOutlined
                        style={{
                            marginRight: 8,
                        }}
                    />
                    深圳市宝安区
                </p>
            </div>
        );
    };

    return (
        <GridContent>
            <Card
                bordered={false}
                style={{
                    marginBottom: 24,
                }}
            >
                <div>
                    <div className={styles.avatarHolder}>
                        {/*<Image alt="个人创作" src={"http://47.120.68.50/download/ludan.jpg"} preview={false}/>*/}
                        <img
                            alt="示例图片"
                            src="http://47.120.68.50/download/ludan.jpg"
                            style={{ borderRadius: '50px' }}
                        />
                        <div className={styles.name}>{"LuDan"}</div>
                        <div>{"努力做最有价值的事情"}</div>
                    </div>
                    {renderUserInfo()}
                    <Divider dashed/>
                    {/*<TagList tags={["羽毛球"]} />*/}
                    <Flex gap="4px 0" wrap>
                        <Tag icon={<TwitterOutlined/>} color="#55acee">
                            羽毛球
                        </Tag>
                        <Tag icon={<YoutubeOutlined/>} color="#cd201f">
                            编程
                        </Tag>
                        <Tag icon={<FacebookOutlined/>} color="#3b5999">
                            宠物
                        </Tag>
                    </Flex>
                    <Divider
                        style={{
                            marginTop: 16,
                        }}
                        dashed
                    />
                    {/*<div className={styles.team}>*/}
                    {/*  <div className={styles.teamTitle}>团队</div>*/}
                    {/*  <Row gutter={36}>*/}
                    {/*    /!*{currentUser.notice &&*!/*/}
                    {/*    /!*  currentUser.notice.map((item) => (*!/*/}
                    {/*    /!*    <Col key={item.id} lg={24} xl={12}>*!/*/}
                    {/*    /!*      <a href={item.href}>*!/*/}
                    {/*    /!*        <Avatar size="small" src={item.logo} />*!/*/}
                    {/*    /!*        {item.member}*!/*/}
                    {/*    /!*      </a>*!/*/}
                    {/*    /!*    </Col>*!/*/}
                    {/*    /!*  ))}*!/*/}
                    {/*  </Row>*/}
                    {/*</div>*/}
                </div>
            </Card>
        </GridContent>
    );
};
export default Center;

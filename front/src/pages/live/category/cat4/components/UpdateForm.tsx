import React, {useRef, useState} from 'react';
import {ModalForm, ProFormText} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from "@@/exports";
import {API} from "@/services/ant-design-pro/typings";
import {ProFormInstance} from "@ant-design/pro-form/lib";
import {upsetLiveCat4} from "@/pages/Account/config/api/upsetLiveCat4";
import {ProFormUploadButton} from "@ant-design/pro-form";
import {Button, UploadFile, UploadProps} from "antd";
import {EditFilled, PlusOutlined} from "@ant-design/icons";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {DndContext, DragEndEvent, PointerSensor, useSensor} from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';


interface DraggableUploadListItemProps {
  originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  file: UploadFile<any>;
}

const DraggableUploadListItem = ({originNode, file}: DraggableUploadListItemProps) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
    id: file.uid,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // prevent preview event when drag end
      className={isDragging ? 'is-dragging' : ''}
      {...attributes}
      {...listeners}
    >
      {/* hide error tooltip when dragging */}
      {file.status === 'error' && isDragging ? originNode.props.children : originNode}
    </div>
  );
};


const LiveCat4UpdateForm: React.FC<API.UpdateFormProps> = ({actionRef, record}) => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false); // 注意这里命名了 setCreateModalOpen
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {distance: 10},
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onDragEnd = ({active, over}: DragEndEvent) => {
    if (active.id !== over?.id) {
      setFileList((prev) => {
        const activeIndex = prev.findIndex((i) => i.uid === active.id);
        const overIndex = prev.findIndex((i) => i.uid === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const onChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
    setFileList(newFileList);
  };

  return (
    <>
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.form',
          defaultMessage: 'Form',
        })}
        size={"large"}
        open={createModalOpen}
        width="400px"
        onFinish={async (value) => {
          const avatarUuids = fileList.map(file => {
            if (file.response && file.response.data && file.response.data.uuid) {
              return file.response.data.uuid;
            } else {
              return file.uid;
            }
          });
          const newValue = {...value, avatar: avatarUuids.toString()}; // 创建一个新的对象，并将 avatarUuids 赋值给 avatar


          const success = await upsetLiveCat4(newValue as API.LiveCat4);
          if (success) {
            if (actionRef?.current) {
              actionRef?.current?.reload();
              return true
            }
          }
        }}
        formRef={formRef}
        request={async () => {
          setFileList([])
          if (record) { // 检查 record 是否存在
            const uuid = record?.avatar.split('/').pop().split('.').shift();
            setFileList([
              {
                uid: uuid,
                name: record.name,
                status: 'done',
                url: record.avatar,
              },
            ])
          }
          // 如果 record 为 null，则直接返回 null 或一个空对象，取决于你的需求
          return {...record};
        }}

        submitter={{
          searchConfig: {
            resetText: '重置',
          },
          resetButtonProps: {
            onClick: () => {
              formRef.current?.resetFields();
            },
          },
        }}
        modalProps={{destroyOnClose: true}}
        trigger={
          <Button
            type="primary"
            size={"small"}
            style={{
              backgroundColor: record ? undefined : 'green' // 使用三元运算符来判断背景颜色
            }}
            icon={record ? <EditFilled/> : <PlusOutlined/>} // 使用三元运算符来判断
          >
            <FormattedMessage
              id={record ? 'pages.searchTable.edit' : 'pages.searchTable.createForm'}
              defaultMessage={record ? 'Edit' : 'New'}
            />
          </Button>
        }
      >
        <ProFormText
          name="id"
          placeholder={intl.formatMessage({
            id: 'pages.searchTable.id',
            defaultMessage: 'id',
          })}
          hidden={true}
        />
        <ProFormText
          name="name"
          placeholder={intl.formatMessage({
            id: 'LiveCat4.table.name',
            defaultMessage: 'Name',
          })}
          rules={[
            {required: true, message: intl.formatMessage({id: 'LiveCat4.updateForm.rule.name'})},
            {
              pattern: /^[a-zA-Z]{1,15}$/,
              message: intl.formatMessage({id: 'LiveCat4.updateForm.rule.name'})
            }
          ]}
        />
        <ProFormText
          name="email"
          placeholder={intl.formatMessage({
            id: 'pages.searchTable.id',
            defaultMessage: 'id',
          })}
          hidden={true}
        />
        <ProFormText
          name="phone"
          placeholder={intl.formatMessage({
            id: 'LiveCat4.table.phone',
            defaultMessage: 'Phone',
          })}
          // rules={[
          //   {required: true, message: intl.formatMessage({id: 'LiveCat4.updateForm.rule.name'})},
          //   {
          //     pattern: /^[a-zA-Z]{1,15}$/,
          //     message: intl.formatMessage({id: 'LiveCat4.updateForm.rule.name'})
          //   }
          // ]}
        />
        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
          <SortableContext items={fileList.map((i) => i.uid)} strategy={verticalListSortingStrategy}>
            <ProFormUploadButton
              title="上传图片"
              name="avatar"
              max={5}
              fileList={fileList}
              fieldProps={{
                multiple: true,
                name: "multipartFile",
                itemRender: (originNode, file) => (
                  <DraggableUploadListItem originNode={originNode} file={file}/>
                ),
                onChange: onChange
              }}
              action="/api/ftp/uploadSingleFile"
            />
          </SortableContext>
        </DndContext>
      </ModalForm>
    </>
  );
};

export default LiveCat4UpdateForm;

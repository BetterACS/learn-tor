import React from 'react';

interface EditButtonsProps {
  isEditing: boolean;
  onEditClick: () => void;
  onCancelClick: () => void;
  onSaveClick: () => void;
}

const EditButtons: React.FC<EditButtonsProps> = ({ isEditing, onEditClick, onCancelClick, onSaveClick }) => {
  return (
    <div className="mt-6 flex justify-start gap-4 w-full">
      {!isEditing ? (
        <button
          className="w-[200px] text-big-button bg-monochrome-50 text-primary-600 border border-primary-600 py-3 px-6 rounded-lg hover:bg-monochrome-100"
          onClick={onEditClick}
        >
          แก้ไขข้อมูล
        </button>
      ) : (
        <>
          <button
            className="w-[200px] text-big-button bg-monochrome-50 text-primary-600 border border-primary-600 py-3 px-6 rounded-lg hover:bg-monochrome-100"
            onClick={onCancelClick}
          >
            ยกเลิก
          </button>
          <button
            className="w-[200px] text-big-button bg-primary text-primary-600 border border-primary-600 py-3 px-6 rounded-lg hover:bg-monochrome-100 ml-4"
            onClick={onSaveClick}
          >
            บันทึก
          </button>
        </>
      )}
    </div>
  );
};

export default EditButtons;

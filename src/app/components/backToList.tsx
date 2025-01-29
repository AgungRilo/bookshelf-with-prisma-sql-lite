import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { InfoCircleOutlined } from '@ant-design/icons';
interface BackToListProps {
    route?: string; // Default route untuk kembali
    data?: boolean; // Default
    onClick?: () => void;
    onCancel?: () => void;
}

const BackToList: React.FC<BackToListProps> = ({ route, data, onClick, onCancel }) => {
    const router = useRouter();
    return (
        <div className='flex justify-between'>
            <div
                onClick={onCancel ?  onCancel:() => router.push(route || '/dashboard')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#1890ff',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <span style={{ fontSize: '18px' }}>←
                </span> 
                <span className="hidden sm:inline">Back to {`${route === '/dashboard' ? 'Dashboard' : 'Detail'}`}</span>
                
            </div>
            {data &&
                <Button onClick={onClick} color="green" variant='outlined' icon={<InfoCircleOutlined />}>
                    Reading Progress
                </Button>
            }
        </div>

    );
};

export default BackToList;

import { Button } from 'antd';
import { useRouter } from 'next/navigation';

interface BackToListProps {
    route?: string; // Default route untuk kembali
    data?: boolean; // Default
    onClick?: () => void;
}

const BackToList: React.FC<BackToListProps> = ({ route, data, onClick }) => {
    const router = useRouter();
    return (
        <div className='flex justify-between'>
            <div
                onClick={() => router.push(route || '/dashboard')}
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
                </span> Back to {`${route === '/dashboard' ? 'Dashboard' : 'Detail'}`}
            </div>
            {data &&
                <Button onClick={onClick}>
                    Reading Progress
                </Button>
            }
        </div>

    );
};

export default BackToList;

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ContentTable } from '@/components/admin/ContentTable';
import { ContentForm } from '@/components/admin/ContentForm';
import {
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { AdminContent } from '@/types/content';

interface Stats {
  totalUsers: number;
  totalContent: number;
  totalViews: number;
  pendingSubmissions: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('Admin');
  const locale = useLocale();

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalContent: 0,
    totalViews: 0,
    pendingSubmissions: 0
  });
  const [recentContent, setRecentContent] = useState<AdminContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Content management state
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<AdminContent | null>(null);
  const [contents, setContents] = useState<AdminContent[]>([]);

  useEffect(() => {
    console.log('🔄 ADMIN PAGE EFFECT - Status:', status, 'Session exists:', !!session, 'Role:', session?.user?.role);

    if (status === 'loading') {
      console.log('⏳ Session still loading...');
      return;
    }

    if (status === 'unauthenticated') {
      console.log('🚫 Unauthenticated, redirecting to signin');
      router.push(`/${locale}/auth/signin`);
      return;
    }

    if (session && session.user?.role !== 'ADMIN') {
      console.log('⚠️ User role:', session.user?.role, 'Expected: ADMIN - redirecting home');
      router.push(`/${locale}`);
      return;
    }

    if (session && session.user?.role === 'ADMIN') {
      console.log('✅ ADMIN USER CONFIRMED - CALLING fetchAdminData');
      fetchAdminData();
    }
  }, [session, status, router, locale]);

  const fetchAdminData = async () => {
    console.log('fetchAdminData started');
    try {
      // Fetch admin statistics
      console.log('About to fetch /api/admin/stats');
      const statsResponse = await fetch('/api/admin/stats');
      console.log('Stats response received:', statsResponse.status);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('Stats data:', statsData);
        setStats(statsData);
      } else {
        console.error('Stats failed:', await statsResponse.text());
      }

      // Fetch recent content
      console.log('About to fetch /api/admin/content');
      const contentResponse = await fetch('/api/admin/content');
      console.log('Content response received:', contentResponse.status);
      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        console.log('Content data length:', contentData.length);
        setRecentContent(contentData.slice(0, 10));
        setContents(contentData || []);
      } else {
        console.error('Content failed:', await contentResponse.text());
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  };

  // Content management functions
  const handleCreateContent = () => {
    setEditingContent(null);
    setShowForm(true);
  };

  const handleEditContent = (content: AdminContent) => {
    setEditingContent(content);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingContent(null);
    fetchAdminData(); // Refresh data
  };

  const handleDeleteContent = async (content: AdminContent) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nội dung này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/content/${content.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchAdminData();
      } else {
        alert('Không thể xóa nội dung');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Đã xảy ra lỗi khi xóa nội dung');
    }
  };

  const handleBulkAction = async (action: string, ids: string[]) => {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids, action })
      });

      if (response.ok) {
        fetchAdminData();
      } else {
        const error = await response.json();
        alert(error.error || 'Không thể thực hiện hành động');
      }
    } catch (error) {
      console.error('Error with bulk action:', error);
      alert('Đã xảy ra lỗi');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statCards = [
    {
      title: t('stats.totalUsers'),
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: t('stats.totalContent'),
      value: stats.totalContent,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: t('stats.totalViews'),
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      title: t('stats.pendingSubmissions'),
      value: stats.pendingSubmissions,
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🚀 ADMIN DASHBOARD (TEST VERSION)
            </h1>
            <p className="text-gray-600">
              {t('welcome', { name: session.user?.name || 'Admin' })}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('quickActions')}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleCreateContent}
                  className="w-full flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  {t('actions.addContent')}
                </button>
                <button className="w-full flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <Users className="w-5 h-5 mr-3" />
                  {t('actions.manageUsers')}
                </button>
                <button className="w-full flex items-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  {t('actions.viewAnalytics')}
                </button>
                <button className="w-full flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5 mr-3" />
                  {t('actions.settings')}
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('recentContent')}
              </h3>
              <div className="space-y-4">
                {recentContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-800 truncate">{item.title}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>{item.type}</span>
                        <span>{item.status}</span>
                        <span>{item.author.name}</span>
                        <span>{item.viewCount} {t('views')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Xem nội dung"
                        onClick={() => window.open(`/content/${item.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Chỉnh sửa"
                        onClick={() => handleEditContent(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Xóa"
                        onClick={() => handleDeleteContent(item)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Management Section */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Quản lý nội dung
                </h2>
                <button
                  onClick={handleCreateContent}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm nội dung
                </button>
              </div>

              {/* Content Table */}
              <ContentTable
                contents={contents}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                onBulkAction={handleBulkAction}
                userRole={session?.user?.role || 'USER'}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Content Form Modal */}
      {showForm && (
        <ContentForm
          content={editingContent}
          onClose={handleFormClose}
          userRole={session?.user?.role || 'USER'}
        />
      )}
    </div>
  );
}
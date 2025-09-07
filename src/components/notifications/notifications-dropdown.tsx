"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Bell, Check, CheckCheck } from "lucide-react";
import { usePusher } from "~/hooks/use-pusher";

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pusher = usePusher();
  
  const { data: notifications, isLoading } = api.notifications.getByUser.useQuery();
  const utils = api.useUtils();
  const markAsRead = api.notifications.markAsRead.useMutation();
  const markAllAsRead = api.notifications.markAllAsRead.useMutation();

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!pusher || !session?.user?.id) return;

    const channel = pusher.subscribe(`user-${session.user.id}`);
    
    channel.bind("new-notification", () => {
      // Refresh notifications when a new one arrives
      utils.notifications.getByUser.invalidate();
    });

    return () => {
      pusher.unsubscribe(`user-${session.user.id}`);
    };
  }, [pusher, session?.user?.id, utils.notifications.getByUser]);

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  const handleMarkAsRead = async (id: string) => {
    await markAsRead.mutateAsync({ id });
    // Invalidate the notifications query to refresh the UI
    await utils.notifications.getByUser.invalidate();
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
      // Invalidate the notifications query to refresh the UI
      await utils.notifications.getByUser.invalidate();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsRead.isPending}
                  className="text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  {markAllAsRead.isPending ? "Marking..." : "Mark all read"}
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              <div className="divide-y">
                {notifications?.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-xs mt-1">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markAsRead.isPending}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

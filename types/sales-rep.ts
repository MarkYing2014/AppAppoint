export interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  territory: string;
  availability: 'available' | 'tentative' | 'busy';
  workingHours: {
    start: string;
    end: string;
  };
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    app: boolean;
  };
}

export interface Territory {
  id: string;
  name: string;
  description: string;
}
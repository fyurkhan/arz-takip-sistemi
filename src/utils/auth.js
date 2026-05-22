// Kullanıcı kaydetme
export const registerUser = (email, password, fullName) => {
  // Mevcut kullanıcıları al
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Kullanıcı zaten var mı kontrol et
  const userExists = users.find((u) => u.email === email);
  if (userExists) {
    return { success: false, error: 'Bu e-posta adresi zaten kayıtlı!' };
  }

  // Yeni kullanıcı oluştur
  const newUser = {
    id: Date.now(),
    email,
    password, // Normalde şifre hash'lenmeli, ama basitlik için düz saklıyoruz
    fullName,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  return { success: true };
};

// Kullanıcı girişi
export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Oturum bilgisini sakla
    const session = {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem('currentSession', JSON.stringify(session));
    return { success: true, user: session.user };
  }

  return { success: false, error: 'E-posta veya şifre hatalı!' };
};

// Oturumu kontrol et
export const getCurrentSession = () => {
  const session = localStorage.getItem('currentSession');
  if (session) {
    return JSON.parse(session);
  }
  return null;
};

// Çıkış yap
export const logoutUser = () => {
  localStorage.removeItem('currentSession');
};

// Demo kullanıcı oluştur (test için)
export const createDemoUser = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const demoExists = users.find((u) => u.email === 'demo@arzguvenligi.com');

  if (!demoExists) {
    users.push({
      id: Date.now(),
      email: 'demo@arzguvenligi.com',
      password: 'demo123',
      fullName: 'Demo Kullanıcı',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('users', JSON.stringify(users));
  }
};

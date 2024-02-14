export const formatUserRes = (user) => {
  const response = {};

  response.credentials = {
    role: user.__t,
  };
  response.posts = user.posts.map((item) => item.post_id);
  response.favorites = user.favorites.map((item) => {
    return {
      post_id: item.post_id,
      status: item.status,
    };
  });

  if (user.__t === "client") {
    response.info = { username: user.info.username };
  } else if (user.__t === "agent") {
    response.avatar = user.avatar;
    response.info = {
      firstname: user.info.firstname,
      lastname: user.info.lastname,
      bio: user.info.bio,
    };
    response.contact_details = {
      public_email: user.contact_details.public_email,
      whatsapp: {
        code: user.contact_details.whatsapp.code,
        phone: user.contact_details.whatsapp.phone,
      },
    };
  }

  return response;
};

export const formatPostRes = (post) => {
  const response = {};

  response.type = post.__t;
  response.id = post._id;
  response.uid = post.uid;
  response.author_role = post.author_role;
  response.images = post.images;
  response.description = post.description;
  response.contact_details = {
    contact_types: {
      phone: post.contact_details.contact_types.phone,
      whatsapp: post.contact_details.contact_types.whatsapp,
    },
    contact: {
      code: post.contact_details.contact.code,
      phone: post.contact_details.contact.phone,
    },
  };
  response.property_details = post.property_details.map((item) => {
    return {
      address: {
        province: item.address.province,
        municipality: item.address.municipality,
      },
      features: {
        bed_room: item.features.bed_room,
        bath_room: item.features.bath_room,
        garage: item.features.garage,
        garden: item.features.garden,
        pool: item.features.pool,
        furnished: item.features.furnished,
      },
    };
  });

  if (post.__t === "sale") {
    response.amount_details = {
      amount: post.amount_details.amount,
      currency: post.amount_details.currency,
    };
  } else if (post.__t === "rent") {
    response.amount_details = {
      amount: post.amount_details.amount,
      currency: post.amount_details.currency,
      frequency: post.amount_details.frequency,
    };
  } else if (post.__t === "exchange") {
    response.offer_details = {
      offers: post.offer_details.offers,
      needs: {
        enable: post.offer_details.needs.enable,
        count: post.offer_details.needs.count,
      },
    };
  }

  return response;
};

export const formatAgentRes = (agent) => {
  return {
    id: agent._id,
    info: {
      firstname: agent.info.firstname,
      lastname: agent.info.lastname,
      bio: agent.info.bio,
    },
    contact_details: {
      public_email: agent.contact_details.public_email,
      whatsapp: {
        code: agent.contact_details.whatsapp.code,
        phone: agent.contact_details.whatsapp.phone,
      },
    },
    posts: agent.posts.map((item) => item.post_id),
  };
};

import supabase from "./supabase";

export async function getServices() {
    const { data, error } = await supabase
        .from('clinic_services')
        .select('*')

    if (error) {
        console.error(error);
        if (error.code === 'PGRST205' || /Could not find the table 'public\.clinic_services'/i.test(error.message || '')) {
            const fallback = await supabase.from('activities').select('*')
            if (fallback.error) {
                console.error(fallback.error);
                throw new Error('Failed to fetch services');
            }
            return fallback.data || []
        }
        throw new Error('Failed to fetch services');
    }

    return data || []
}

export async function createBooking(booking) {
    const { data, error } = await supabase
        .from('users_bookings')
        .insert([booking])
        .select()

    if (error) {
        console.error(error);
        throw new Error('Failed to create booking');
    }

    return data
}

export async function getBookings(page = 1, itemsPerPage = 8) {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // Get total count
    const { count, error: countError } = await supabase
        .from('users_bookings')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error(countError);
        throw new Error('Failed to fetch bookings count');
    }

    // Get paginated data
    const { data, error } = await supabase
        .from('users_bookings')
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        throw new Error('Failed to fetch bookings');
    }

    return {
        data,
        totalItems: count,
        totalPages: Math.ceil(count / itemsPerPage),
        currentPage: page,
        itemsPerPage
    };
}

export async function updateBooking(bookingId, updatedBooking) {
    const { data, error } = await supabase
        .from('users_bookings')
        .update(updatedBooking)
        .eq('id', bookingId)
        .select()

    if (error) {
        console.error(error);
        throw new Error('Failed to update booking');
    }

    return data[0];
}

export async function createService(service) {
    const { data, error } = await supabase
        .from('clinic_services')
        .insert([service])
        .select()

    if (error) {
        console.error(error);
        throw new Error('Failed to create service');
    }

    return data[0];
}

export async function updateService(serviceId, updatedService) {
    const { data, error } = await supabase
        .from('clinic_services')
        .update(updatedService)
        .eq('id', serviceId)
        .select()

    if (error) {
        console.error(error);
        throw new Error('Failed to update service');
    }

    return data[0];
}

export async function deleteBooking(bookingId) {
    const { error } = await supabase
        .from('users_bookings')
        .delete()
        .eq('id', bookingId)

    if (error) {
        console.error(error);
        throw new Error('Failed to delete booking');
    }

    return true;
}

export async function deleteService(serviceId) {
    const { error } = await supabase
        .from('clinic_services')
        .delete()
        .eq('id', serviceId)

    if (error) {
        console.error(error);
        throw new Error('Failed to delete service');
    }

  return true;
}

export async function getFeaturedArticles(limit = 3) {
    const { data, error } = await supabase
        .from('blog')
        .select('*')
        .eq('show_on_homepage', true)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error(error);
        if (error.code === 'PGRST205' || /Could not find the table 'public\.blog'/i.test(error.message || '')) {
            return []
        }
        throw new Error('Failed to fetch articles');
    }

    return data || [];
}

export async function getAllArticles() {
    const { data, error } = await supabase
        .from('blog')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error);
        if (error.code === 'PGRST205' || /Could not find the table 'public\.blog'/i.test(error.message || '')) {
            return []
        }
        throw new Error('Failed to fetch articles');
    }

    return data || [];
}

export async function getArticleById(id) {
    const { data, error } = await supabase
        .from('blog')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error(error);
        if (error.code === 'PGRST205' || /Could not find the table 'public\.blog'/i.test(error.message || '')) {
            return null
        }
        throw new Error('Failed to fetch article');
    }

    return data;
}
